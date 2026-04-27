import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id';

// ---- PayPhone config ----
const PAYPHONE_TOKEN = process.env.PAYPHONE_TOKEN || '';
const PAYPHONE_STORE_ID = process.env.PAYPHONE_STORE_ID || '';
const PAYPHONE_BASE_URL = process.env.PAYPHONE_BASE_URL || 'https://pay.payfphone.com';
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5173';

// ---- Business config ----
const LEAD_FEE_RATE = parseFloat(process.env.LEAD_FEE_RATE || '0.06');
const LEAD_MIN_COST_USD = parseFloat(process.env.LEAD_MIN_COST_USD || '3');

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ====================================================================
// CONFIGURACIÓN DE CORREO (NODEMAILER)
// ====================================================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ====================================================================
// HELPERS
// ====================================================================

/** Calcula el costo en USD para un lead basado en el presupuesto estimado */
function calculateLeadCostUSD(estimatedBudget: number): number {
  const raw = estimatedBudget * LEAD_FEE_RATE;
  return Math.max(raw, LEAD_MIN_COST_USD);
}

// ====================================================================
// RUTAS DE AUTENTICACIÓN
// ====================================================================

// 1. Registro
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, role, phone } = req.body;
    const finalRole = 'guest'; // Siempre forzar guest al inicio

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: finalRole,
          phone,
          emailVerified: false,
          verificationToken,
        },
      });

      return newUser;
    });

    const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`;
    try {
      await transporter.sendMail({
        from: `"ArtoCamello Cuentas" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta en ArtoCamello',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #FFCA0C; font-size: 24px;">¡Bienvenido a ArtoCamello!</h1>
            <p>Hola <b>${fullName}</b>,</p>
            <p>Gracias por unirte. Para acceder a tu panel, verifica que este es tu correo.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #101828; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Verificar mi cuenta
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Si el botón no funciona, copia y pega este enlace:</p>
            <p style="font-size: 14px; color: #1DBF73; word-break: break-all;">${verificationLink}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Error enviando correo de verificación:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Usuario registrado. Por favor verifica tu bandeja para activar la cuenta.',
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ error: 'Hubo un error en el servidor al intentar registrarte' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ error: 'Tu correo no ha sido verificado. Revisa tu bandeja de entrada o spam.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'Hubo un error en el servidor al intentar iniciar sesión' });
  }
});

// 3. Login y Registro vía Google
app.post('/api/auth/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, role } = req.body;

    let payload: any;
    if (credential.startsWith('ya29.')) {
      // Es un Access Token (proviene de un botón personalizado con useGoogleLogin)
      try {
        const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
        if (!userInfoRes.ok) {
          throw new Error('No se pudo obtener información del usuario desde Google');
        }
        payload = await userInfoRes.json();
        // Mapear campos de userinfo a lo que espera el payload de ID Token
        if (payload.picture && !payload.picture.startsWith('http')) {
           // a veces viene vacío o diferente
        }
      } catch (err) {
        console.error('Google access token verification failed', err);
        res.status(401).json({ error: 'Token de acceso de Google inválido o expirado.' });
        return;
      }
    } else {
      // Es un ID Token (JWT estándar de GoogleLogin)
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (err) {
        console.error('Google ID token verification failed', err);
        res.status(401).json({ error: 'Firma de Google inválida o credenciales caducadas.' });
        return;
      }
    }

    if (!payload || !payload.email) {
      res.status(401).json({ error: 'Token de Google sin email ligado.' });
      return;
    }

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const defaultRole = 'guest'; // Forzar guest para Google auth nuevo
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: null,
            authProvider: 'google',
            fullName: name || 'Usuario Google',
            avatarUrl: picture,
            emailVerified: true,
            role: defaultRole,
          },
        });

        return newUser;
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const jwtToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ user: userWithoutPassword, token: jwtToken });
  } catch (error) {
    console.error('Error in /google:', error);
    res.status(500).json({ error: 'Hubo un error en el servidor al asociar Google' });
  }
});

// 4. Verificación de Correo
app.get('/api/auth/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Token de verificación no proporcionado o inválido' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { verificationToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Token caducado o inexistente. Tu cuenta ya pudo haber sido verificada.' });
      return;
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    const { password: _, ...userWithoutPassword } = verifiedUser;

    const jwtToken = jwt.sign(
      { userId: verifiedUser.id, role: verifiedUser.role, email: verifiedUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ user: userWithoutPassword, token: jwtToken });
  } catch (error) {
    console.error('Error in /verify:', error);
    res.status(500).json({ error: 'Fallo al procesar la verificación' });
  }
});

// ====================================================================
// MIDDLEWARE DE AUTENTICACIÓN
// ====================================================================

export interface AuthRequest extends Request {
  user?: { userId: string; role: string; email: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Denegado: No token proveído' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Denegado: Token inválido o expirado' });
      return;
    }
    req.user = decoded as any;
    next();
  });
};

// ====================================================================
// RUTAS PROTEGIDAS — ONBOARDING
// ====================================================================

// 5. Establecer Rol en el Onboarding
app.post('/api/auth/role', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const userId = req.user!.userId;

    if (role !== 'client' && role !== 'pro') {
      res.status(400).json({ error: 'Rol inválido' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true, professionalProfile: true },
    });
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Limpiar perfiles anteriores para evitar conflictos si el usuario cambió de opinión en el onboarding
      if (role === 'client') {
        await tx.professionalProfile.deleteMany({ where: { userId } });
        if (!user.clientProfile) {
          await tx.clientProfile.create({ data: { userId } });
        }
      } else if (role === 'pro') {
        await tx.clientProfile.deleteMany({ where: { userId } });
        if (!user.professionalProfile) {
          await tx.professionalProfile.create({
            data: { userId, bio: '', categories: [], serviceZones: [] },
          });
        }
      }

      const updated = await tx.user.update({ where: { id: userId }, data: { role } });
      return updated;
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    const newToken = jwt.sign(
      { userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ user: userWithoutPassword, token: newToken });
  } catch (error) {
    console.error('Error in /api/auth/role:', error);
    res.status(500).json({ error: 'Error al asignar el rol' });
  }
});

// ====================================================================
// RUTAS DE PETICIONES (SOLICITUDES DE CLIENTES)
// ====================================================================

// 6. Crear una nueva petición (Cliente)
app.post('/api/requests', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      categorySlug, title, description, location,
      urgency, preferredDate, contactPhone, contactEmail, estimatedBudget,
    } = req.body;

    if (!estimatedBudget || estimatedBudget <= 0) {
      res.status(400).json({ error: 'Debes indicar un presupuesto estimado mayor a 0.' });
      return;
    }

    const newRequest = await prisma.serviceRequest.create({
      data: {
        clientId: req.user!.userId,
        categorySlug,
        title,
        description,
        location,
        urgency,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        status: 'contact_limit_open',
        contactPhone,
        contactEmail,
        estimatedBudget: parseFloat(estimatedBudget),
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Error al crear la petición' });
  }
});

// 7. Mis Peticiones (Cliente)
app.get('/api/requests/client', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { clientId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error getting client requests:', error);
    res.status(500).json({ error: 'Error al obtener peticiones' });
  }
});

// 8. Peticiones Disponibles para Profesionales — incluye costUSD calculado
app.get('/api/requests/available', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestingUser = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { professionalProfile: true },
    });
    if (requestingUser?.role !== 'pro' || !requestingUser.professionalProfile) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }
    const realProfId = requestingUser.professionalProfile.id;

    const requests = await prisma.serviceRequest.findMany({
      where: {
        status: { in: ['contact_limit_open', 'matching'] },
        purchaseCount: { lt: 4 },
        leadPurchases: {
          none: { professionalId: realProfId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = requestingUser.professionalProfile.categories;
    const filtered = categories.length > 0
      ? requests.filter((r) => categories.includes(r.categorySlug))
      : requests;

    // Añadir costUSD calculado para que el frontend lo muestre sin lógica de negocio
    const enriched = filtered.map((r) => ({
      ...r,
      costUSD: parseFloat(calculateLeadCostUSD(r.estimatedBudget).toFixed(2)),
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error('Error in /api/requests/available:', error);
    res.status(500).json({ error: 'Error al obtener requerimientos disponibles' });
  }
});

// ====================================================================
// RUTAS DE LEADS — PAGO DIRECTO CON PAYPHONE (REDIRECT)
// ====================================================================

/**
 * POST /api/leads/pay
 * Crea la intención de pago en PayPhone y devuelve la URL de redirección.
 * El profesional es redirigido a PayPhone, paga, y PayPhone regresa a la app.
 */
app.post('/api/leads/pay', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.body;

    const requestingUser = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { professionalProfile: true },
    });

    if (requestingUser?.role !== 'pro' || !requestingUser.professionalProfile) {
      res.status(403).json({ error: 'Sólo perfiles profesionales pueden comprar contactos.' });
      return;
    }

    const realProfId = requestingUser.professionalProfile.id;

    const request = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      res.status(404).json({ error: 'Solicitud no encontrada.' });
      return;
    }
    if (request.status === 'cancelled') {
      res.status(400).json({ error: 'Esta solicitud fue cancelada.' });
      return;
    }
    if (request.purchaseCount >= 4) {
      res.status(400).json({ error: 'Límite de 4 profesionales alcanzado para esta solicitud.' });
      return;
    }

    // Verificar que no haya comprado ya este lead (incluyendo estado pending, para no crear duplicados)
    const existingPurchase = await prisma.leadPurchase.findUnique({
      where: { requestId_professionalId: { requestId, professionalId: realProfId } },
    });
    if (existingPurchase && existingPurchase.status === 'paid') {
      res.status(400).json({ error: 'Ya has comprado este contacto.' });
      return;
    }

    const costUSD = parseFloat(calculateLeadCostUSD(request.estimatedBudget).toFixed(2));

    // ID único de nuestra transacción para identificar el callback de PayPhone
    const clientTxId = crypto.randomUUID();

    // Crear o actualizar LeadPurchase en estado pending
    if (existingPurchase) {
      // Si existía un pending fallido, lo actualizamos
      await prisma.leadPurchase.update({
        where: { id: existingPurchase.id },
        data: { costUSD, payphoneClientTxId: clientTxId, status: 'pending' },
      });
    } else {
      await prisma.leadPurchase.create({
        data: {
          requestId,
          professionalId: realProfId,
          costUSD,
          status: 'pending',
          payphoneClientTxId: clientTxId,
        },
      });
    }

    // ------------------------------------------------------------------
    // Llamada a la API de PayPhone para crear el link de pago
    // Documentación oficial PayPhone Button 2.0:
    //   POST https://pay.payfphone.com/v2/link
    // ------------------------------------------------------------------
    const amountInCents = Math.round(costUSD * 100); // PayPhone trabaja en centavos

    const payphonePayload = {
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: 'USD',
      storeId: PAYPHONE_STORE_ID,
      reference: `lead-${requestId.substring(0, 8)}`,
      clientTransactionId: clientTxId,
      responseUrl: `${APP_BASE_URL}/dashboard/payment-success`,
      cancellationUrl: `${APP_BASE_URL}/dashboard/payment-failed`,
      lang: 'es',
    };

    // Si no hay token de PayPhone configurado, usamos un mock para desarrollo
    if (!PAYPHONE_TOKEN || PAYPHONE_TOKEN === 'TU_PAYPHONE_TOKEN_AQUI') {
      console.warn('[PAYPHONE MOCK] Credenciales no configuradas. Devolviendo URL de simulación.');
      const mockRedirectUrl = `${APP_BASE_URL}/dashboard/payment-success?clientTxId=${clientTxId}&id=MOCK_TX_ID&transactionStatus=Approved`;
      res.status(200).json({ redirectUrl: mockRedirectUrl, costUSD, clientTxId });
      return;
    }

    const payphoneRes = await fetch(`${PAYPHONE_BASE_URL}/v2/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYPHONE_TOKEN}`,
      },
      body: JSON.stringify(payphonePayload),
    });

    if (!payphoneRes.ok) {
      const errorBody = await payphoneRes.text();
      console.error('PayPhone API error:', errorBody);
      res.status(502).json({ error: 'Error al crear el enlace de pago con PayPhone.' });
      return;
    }

    const payphoneData = (await payphoneRes.json()) as { payWithPayPhone: string };
    res.status(200).json({
      redirectUrl: payphoneData.payWithPayPhone,
      costUSD,
      clientTxId,
    });
  } catch (error) {
    console.error('Error in /api/leads/pay:', error);
    res.status(500).json({ error: 'Error del servidor al iniciar el pago.' });
  }
});

/**
 * POST /api/leads/pay/confirm
 * Callback de confirmación. El frontend llama este endpoint cuando PayPhone retorna exitosamente.
 * Verifica el pago con la API de PayPhone y marca el lead como 'paid'.
 */
app.post('/api/leads/pay/confirm', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientTxId, payphoneTransactionId } = req.body;

    if (!clientTxId) {
      res.status(400).json({ error: 'clientTxId es requerido.' });
      return;
    }

    const purchase = await prisma.leadPurchase.findUnique({
      where: { payphoneClientTxId: clientTxId },
      include: { request: true },
    });

    if (!purchase) {
      res.status(404).json({ error: 'Intención de pago no encontrada.' });
      return;
    }

    if (purchase.status === 'paid') {
      // Ya confirmado anteriormente — devolver los datos del contacto directamente
      const request = purchase.request;
      res.status(200).json({
        success: true,
        alreadyPaid: true,
        contactPhone: request.contactPhone,
        contactEmail: request.contactEmail,
      });
      return;
    }

    // ------------------------------------------------------------------
    // Verificar el pago con PayPhone
    // GET https://pay.payfphone.com/v2/link?clientTransactionId=<id>
    // ------------------------------------------------------------------
    let payphoneVerified = false;
    let realTxId = payphoneTransactionId || '';

    if (!PAYPHONE_TOKEN || PAYPHONE_TOKEN === 'TU_PAYPHONE_TOKEN_AQUI') {
      // MOCK: en desarrollo, si el payphoneTransactionId es 'MOCK_TX_ID', aprobamos
      console.warn('[PAYPHONE MOCK] Aprobando transacción en modo desarrollo.');
      payphoneVerified = true;
      realTxId = 'MOCK_TX_ID';
    } else {
      const verifyRes = await fetch(
        `${PAYPHONE_BASE_URL}/v2/link?clientTransactionId=${clientTxId}`,
        {
          headers: { Authorization: `Bearer ${PAYPHONE_TOKEN}` },
        }
      );

      if (verifyRes.ok) {
        const verifyData = (await verifyRes.json()) as {
          transactionStatus: string;
          transactionId?: number;
        };
        payphoneVerified = verifyData.transactionStatus === 'Approved';
        realTxId = verifyData.transactionId?.toString() || '';
      }
    }

    if (!payphoneVerified) {
      // Marcar como fallido
      await prisma.leadPurchase.update({
        where: { id: purchase.id },
        data: { status: 'failed' },
      });
      res.status(402).json({ error: 'El pago no fue aprobado por PayPhone.' });
      return;
    }

    // Confirmar el pago en base de datos (transacción atómica)
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.leadPurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'paid',
          payphoneTransactionId: realTxId,
          paidAt: new Date(),
        },
        include: { request: true },
      });

      // Incrementar contador de compras en la solicitud
      const newCount = purchase.request.purchaseCount + 1;
      let newStatus = purchase.request.status;
      if (newCount >= 4) newStatus = 'contact_limit_reached';

      await tx.serviceRequest.update({
        where: { id: purchase.requestId },
        data: { purchaseCount: newCount, status: newStatus },
      });

      return updated;
    });

    res.status(200).json({
      success: true,
      contactPhone: result.request.contactPhone,
      contactEmail: result.request.contactEmail,
      costUSD: result.costUSD,
    });
  } catch (error) {
    console.error('Error in /api/leads/pay/confirm:', error);
    res.status(500).json({ error: 'Error del servidor al confirmar el pago.' });
  }
});

/**
 * GET /api/leads/unlocked
 * Lista los contactos adquiridos (pagados) por el profesional autenticado.
 */
app.get('/api/leads/unlocked', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestingUser = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { professionalProfile: true },
    });
    if (requestingUser?.role !== 'pro' || !requestingUser.professionalProfile) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    const realProfId = requestingUser.professionalProfile.id;

    const purchases = await prisma.leadPurchase.findMany({
      where: { professionalId: realProfId, status: 'paid' },
      orderBy: { paidAt: 'desc' },
      include: {
        request: { include: { client: true } },
      },
    });

    const formatted = purchases.map((p) => ({
      purchase: {
        id: p.id,
        requestId: p.requestId,
        costUSD: p.costUSD,
        status: p.status,
        purchasedAt: p.paidAt || p.purchasedAt,
        payphoneTransactionId: p.payphoneTransactionId,
      },
      requestTitle: p.request.title,
      clientName: p.request.client.fullName,
      clientPhone: p.request.contactPhone,
      clientEmail: p.request.contactEmail,
      location: p.request.location,
      estimatedBudget: p.request.estimatedBudget,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error in /api/leads/unlocked:', error);
    res.status(500).json({ error: 'Error al obtener leads desbloqueados' });
  }
});

/**
 * GET /api/payments/history
 * Historial de todos los pagos realizados por el profesional (para la sección de Facturación).
 */
app.get('/api/payments/history', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestingUser = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { professionalProfile: true },
    });
    if (requestingUser?.role !== 'pro' || !requestingUser.professionalProfile) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    const realProfId = requestingUser.professionalProfile.id;

    const payments = await prisma.leadPurchase.findMany({
      where: { professionalId: realProfId, status: 'paid' },
      orderBy: { paidAt: 'desc' },
      include: { request: true },
    });

    const history = payments.map((p) => ({
      id: p.id,
      date: p.paidAt || p.purchasedAt,
      description: `Contacto: ${p.request.title}`,
      location: p.request.location,
      costUSD: p.costUSD,
      payphoneTransactionId: p.payphoneTransactionId,
      requestId: p.requestId,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error('Error in /api/payments/history:', error);
    res.status(500).json({ error: 'Error al obtener el historial de pagos' });
  }
});

// ====================================================================
// RUTAS DE PERFIL PROFESIONAL
// ====================================================================

/**
 * GET /api/profile
 * Devuelve el perfil completo del profesional autenticado
 * (datos de User + ProfessionalProfile).
 */
app.get('/api/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { professionalProfile: true },
    });

    if (!user || user.role !== 'pro') {
      res.status(403).json({ error: 'Solo perfiles profesionales pueden acceder a esta ruta.' });
      return;
    }

    const { password: _, verificationToken: __, ...safeUser } = user;

    res.status(200).json({
      user: safeUser,
      profile: user.professionalProfile,
    });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
});

/**
 * PUT /api/profile
 * Actualiza el perfil del profesional autenticado.
 * Acepta:
 *   - fullName, phone (en User)
 *   - businessName, bio, categories, serviceZones, experienceYears,
 *     portfolioImages, avatarUrl (en ProfessionalProfile / User)
 */
app.put('/api/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      avatarUrl,
      businessName,
      bio,
      categories,
      serviceZones,
      experienceYears,
      portfolioImages,
      skills,
      city,
      address,
      documentType,
      documentId,
    } = req.body;

    const userId = req.user!.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true },
    });

    if (!existingUser || existingUser.role !== 'pro') {
      res.status(403).json({ error: 'Solo profesionales pueden actualizar este perfil.' });
      return;
    }

    // Actualizar datos básicos del User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    // Actualizar ProfessionalProfile
    let updatedProfile = existingUser.professionalProfile;
    if (updatedProfile) {
      updatedProfile = await prisma.professionalProfile.update({
        where: { userId },
        data: {
          ...(businessName !== undefined && { businessName }),
          ...(bio !== undefined && { bio }),
          ...(categories !== undefined && { categories }),
          ...(serviceZones !== undefined && { serviceZones }),
          ...(experienceYears !== undefined && { experienceYears: parseInt(experienceYears) }),
          ...(portfolioImages !== undefined && { portfolioImages }),
          ...(skills !== undefined && { skills }),
          ...(city !== undefined && { city }),
          ...(address !== undefined && { address }),
          ...(documentType !== undefined && { documentType }),
          ...(documentId !== undefined && { documentId }),
        },
      });
    }

    const { password: _, verificationToken: __, ...safeUser } = updatedUser;

    res.status(200).json({
      success: true,
      user: safeUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error in PUT /api/profile:', error);
    res.status(500).json({ error: 'Error al guardar el perfil.' });
  }
});

// ====================================================================
// RUTAS DE PERFIL CLIENTE
// ====================================================================

/**
 * GET /api/client/profile
 * Devuelve el perfil completo del cliente autenticado.
 */
app.get('/api/client/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { clientProfile: true },
    });

    if (!user || user.role !== 'client') {
      res.status(403).json({ error: 'Solo perfiles de clientes pueden acceder a esta ruta.' });
      return;
    }

    const { password: _, verificationToken: __, ...safeUser } = user;

    res.status(200).json({
      user: safeUser,
      profile: user.clientProfile,
    });
  } catch (error) {
    console.error('Error in GET /api/client/profile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
});

/**
 * PUT /api/client/profile
 * Actualiza el perfil del cliente autenticado.
 */
app.put('/api/client/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      avatarUrl,
      addresses,
    } = req.body;

    const userId = req.user!.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true },
    });

    if (!existingUser || existingUser.role !== 'client') {
      res.status(403).json({ error: 'Solo clientes pueden actualizar este perfil.' });
      return;
    }

    // Actualizar datos básicos del User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    // Actualizar ClientProfile
    let updatedProfile = existingUser.clientProfile;
    if (updatedProfile && addresses !== undefined) {
      updatedProfile = await prisma.clientProfile.update({
        where: { userId },
        data: {
          addresses, // Pasmos todo el array de strings serializados
        },
      });
    }

    const { password: _, verificationToken: __, ...safeUser } = updatedUser;

    res.status(200).json({
      success: true,
      user: safeUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error in PUT /api/client/profile:', error);
    res.status(500).json({ error: 'Error al guardar el perfil.' });
  }
});

/**
 * POST /api/profile/change-password
 * Cambia la contraseña del usuario autenticado.
 */
app.post('/api/profile/change-password', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Contraseña actual y nueva son requeridas.' });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user || !user.password) {
      res.status(400).json({ error: 'Esta cuenta usa autenticación social y no tiene contraseña.' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'La contraseña actual no es correcta.' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error in POST /api/profile/change-password:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña.' });
  }
});

// ====================================================================
// RUTAS DE BÚSQUEDA DE PROFESIONALES
// ====================================================================

/**
 * GET /api/professionals
 * Devuelve la lista de profesionales públicos.
 */
app.get('/api/professionals', async (req: Request, res: Response): Promise<void> => {
  try {
    const pros = await prisma.user.findMany({
      where: { role: 'pro' },
      include: { professionalProfile: true },
    });

    // Mapeamos para enviar solo los datos seguros/públicos
    const mappedPros = pros.map(user => {
      const { password, verificationToken, email, phone, ...publicUser } = user;
      return {
        ...publicUser,
        profile: user.professionalProfile
      };
    });

    res.status(200).json(mappedPros);
  } catch (error) {
    console.error('Error in GET /api/professionals:', error);
    res.status(500).json({ error: 'Error al cargar profesionales' });
  }
});

/**
 * GET /api/professionals/:id
 * Devuelve un profesional público por su userId.
 */
app.get('/api/professionals/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
      where: { id: id, role: 'pro' },
      include: { 
        professionalProfile: true,
        reviewsReceived: {
          include: {
            client: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!user || !user.professionalProfile) {
      res.status(404).json({ error: 'Profesional no encontrado' });
      return;
    }

    const { password, verificationToken, email, phone, ...publicUser } = user;
    
    res.status(200).json({
      ...publicUser,
      profile: user.professionalProfile,
      reviews: user.reviewsReceived
    });
  } catch (error) {
    console.error('Error in GET /api/professionals/:id:', error);
    res.status(500).json({ error: 'Error al cargar profesional' });
  }
});

/**
 * POST /api/professionals/:id/reviews
 * Permite a un cliente verificado dejar una reseña a un profesional.
 */
app.post('/api/professionals/:id/reviews', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: professionalId } = req.params;
    const { rating, comment } = req.body;
    const clientId = req.user!.userId;

    if (!rating || !comment) {
      res.status(400).json({ error: 'Calificación y comentario son obligatorios.' });
      return;
    }

    // 1. Verificar que el cliente esté verificado
    const client = await prisma.user.findUnique({ where: { id: clientId } });
    if (!client || !client.emailVerified) {
      res.status(403).json({ error: 'Tu cuenta debe estar verificada por correo para dejar reseñas.' });
      return;
    }

    // 2. Verificar que el profesional existe
    const pro = await prisma.user.findFirst({
      where: { id: professionalId, role: 'pro' },
      include: { professionalProfile: true }
    });

    if (!pro || !pro.professionalProfile) {
      res.status(404).json({ error: 'Profesional no encontrado.' });
      return;
    }

    // 3. Crear la reseña
    const newReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          rating: Number(rating),
          comment,
          clientId,
          professionalId
        },
        include: {
          client: {
            select: {
              fullName: true,
              avatarUrl: true
            }
          }
        }
      });

      // 4. Actualizar agregados en el perfil del profesional
      const allReviews = await tx.review.findMany({
        where: { professionalId }
      });

      const count = allReviews.length;
      const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / count;

      await tx.professionalProfile.update({
        where: { userId: professionalId },
        data: {
          rating: avg,
          reviewCount: count
        }
      });

      return review;
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error in POST /api/professionals/:id/reviews:', error);
    res.status(500).json({ error: 'Error al publicar la reseña.' });
  }
});

// ====================================================================
// RUTAS DE PREFERENCIAS DE NOTIFICACIONES
// ====================================================================

/**
 * POST /api/notifications/preferences
 * Recibe la preferencia de notificación y envía un correo de confirmación.
 * Body: { preference: string, enabled: boolean, label: string }
 */
app.post('/api/notifications/preferences', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { preference, enabled, label } = req.body;

    if (!preference || typeof enabled !== 'boolean') {
      res.status(400).json({ error: 'Datos de preferencia inválidos.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    // Solo enviar correo cuando se ACTIVA la notificación
    if (enabled) {
      const statusText = 'activada';
      const statusColor = '#16a34a';
      const statusIcon = '✅';

      try {
        await transporter.sendMail({
          from: `"ArtoCamello Notificaciones" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: `Notificación ${statusText}: ${label}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
              <!-- Header -->
              <div style="background: #101828; padding: 30px 40px; text-align: center;">
                <h1 style="color: #FFCA0C; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">
                  Arto<span style="color: #ffffff;">Camello</span>
                </h1>
                <p style="color: #9ca3af; font-size: 13px; margin-top: 6px;">Preferencias de notificación</p>
              </div>

              <!-- Body -->
              <div style="padding: 40px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 48px;">${statusIcon}</span>
                </div>

                <h2 style="color: #101828; font-size: 20px; text-align: center; margin-bottom: 8px;">
                  Notificación ${statusText}
                </h2>
                <p style="color: #6b7280; font-size: 15px; text-align: center; margin-bottom: 30px;">
                  Hola <strong>${user.fullName}</strong>, te confirmamos que tu preferencia ha sido actualizada.
                </p>

                <!-- Preference Card -->
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                  <table style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <span style="color: #6b7280; font-size: 13px;">Preferencia</span><br/>
                        <strong style="color: #101828; font-size: 15px;">${label}</strong>
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <span style="background: ${statusColor}; color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                          ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>

                <p style="color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                  Recibirás correos electrónicos según esta preferencia.<br/>
                  Puedes cambiar esto en cualquier momento desde tu panel.
                </p>
              </div>

              <!-- Footer -->
              <div style="background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} ArtoCamello · Todos los derechos reservados
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Error enviando correo de notificación:', emailErr);
        // No fallar la request si el correo falla
      }
    }

    res.status(200).json({ 
      success: true, 
      message: enabled 
        ? `Notificación "${label}" activada. Se envió un correo de confirmación.`
        : `Notificación "${label}" desactivada.`,
      preference,
      enabled,
    });
  } catch (error) {
    console.error('Error in /api/notifications/preferences:', error);
    res.status(500).json({ error: 'Error al actualizar la preferencia de notificación.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Backend Server running at http://localhost:${port}`);
});

