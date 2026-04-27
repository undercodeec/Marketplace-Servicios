// ====================================================================
// ArtoCamello — Service-Specific Questions for Contact Form
// ====================================================================

export interface QuestionOption {
  label: string;
  value: string;
}

export interface ServiceQuestion {
  id: string;
  label: string;
  type: 'radio' | 'select' | 'text' | 'counter';
  options?: QuestionOption[];
  placeholder?: string;
  /** Show this question only when a previous question has a specific answer */
  showWhen?: { questionId: string; value: string };
}

export interface ServiceQuestionSet {
  categoryKeys: string[];  // All category names/slugs that match this set
  title: string;           // Displayed at the top of Step 1
  questions: ServiceQuestion[];
}

// ── Question sets per service category ───────────────────────────────

const fontaneria: ServiceQuestionSet = {
  categoryKeys: ['fontanería', 'fontaneria', 'fontaneros', 'plomería', 'plomeria'],
  title: 'Fontanería',
  questions: [
    {
      id: 'issue_type',
      label: '¿Qué tipo de problema tienes?',
      type: 'radio',
      options: [
        { label: 'Gotera / filtración', value: 'gotera' },
        { label: 'Tubería rota', value: 'tuberia_rota' },
        { label: 'Instalación nueva', value: 'instalacion' },
        { label: 'Desatasco', value: 'desatasco' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'location',
      label: '¿Dónde está el problema?',
      type: 'radio',
      options: [
        { label: 'Baño', value: 'bano' },
        { label: 'Cocina', value: 'cocina' },
        { label: 'Lavandería', value: 'lavanderia' },
        { label: 'Jardín / exterior', value: 'exterior' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'quantity',
      label: '¿Cuántos puntos necesitan atención?',
      type: 'counter',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5+', value: '5+' },
      ],
    },
  ],
};

const pintura: ServiceQuestionSet = {
  categoryKeys: ['pintura', 'pintores', 'pintor'],
  title: 'Pintura',
  questions: [
    {
      id: 'paint_area',
      label: '¿Qué necesitas pintar?',
      type: 'radio',
      options: [
        { label: 'Interior', value: 'interior' },
        { label: 'Exterior', value: 'exterior' },
        { label: 'Ambos', value: 'ambos' },
      ],
    },
    {
      id: 'surface_type',
      label: '¿Qué tipo de superficie?',
      type: 'radio',
      options: [
        { label: 'Paredes', value: 'paredes' },
        { label: 'Techos', value: 'techos' },
        { label: 'Fachada', value: 'fachada' },
        { label: 'Puertas / ventanas', value: 'puertas_ventanas' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'area_size',
      label: '¿Cuál es el área aproximada?',
      type: 'radio',
      options: [
        { label: 'Menos de 20m²', value: 'menos_20' },
        { label: '20 - 50m²', value: '20_50' },
        { label: '50 - 100m²', value: '50_100' },
        { label: 'Más de 100m²', value: 'mas_100' },
      ],
    },
    {
      id: 'has_paint',
      label: '¿Ya tienes la pintura?',
      type: 'radio',
      options: [
        { label: 'Sí', value: 'si' },
        { label: 'No, necesito que la compren', value: 'no' },
      ],
    },
  ],
};

const albanileria: ServiceQuestionSet = {
  categoryKeys: ['albañilería', 'albanileria', 'albañiles', 'remodelaciones', 'reformas', 'reparaciones'],
  title: 'Albañilería y Remodelaciones',
  questions: [
    {
      id: 'work_type',
      label: '¿Qué tipo de trabajo necesitas?',
      type: 'radio',
      options: [
        { label: 'Construcción nueva', value: 'construccion' },
        { label: 'Remodelación', value: 'remodelacion' },
        { label: 'Reparación', value: 'reparacion' },
        { label: 'Ampliación', value: 'ampliacion' },
      ],
    },
    {
      id: 'space_type',
      label: '¿Qué espacio?',
      type: 'radio',
      options: [
        { label: 'Baño', value: 'bano' },
        { label: 'Cocina', value: 'cocina' },
        { label: 'Habitación', value: 'habitacion' },
        { label: 'Terraza / patio', value: 'terraza' },
        { label: 'Fachada', value: 'fachada' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'area_size',
      label: '¿Cuál es el tamaño aproximado?',
      type: 'radio',
      options: [
        { label: 'Pequeño (menos de 10m²)', value: 'pequeno' },
        { label: 'Mediano (10 - 30m²)', value: 'mediano' },
        { label: 'Grande (más de 30m²)', value: 'grande' },
      ],
    },
  ],
};

const limpieza: ServiceQuestionSet = {
  categoryKeys: ['limpieza a domicilio', 'limpieza comercial', 'limpieza', 'limpieza a domicilio'],
  title: 'Limpieza',
  questions: [
    {
      id: 'cleaning_type',
      label: '¿Qué tipo de limpieza necesitas?',
      type: 'radio',
      options: [
        { label: 'Limpieza regular', value: 'regular' },
        { label: 'Limpieza profunda', value: 'profunda' },
        { label: 'Limpieza post-obra', value: 'post_obra' },
        { label: 'Limpieza de mudanza', value: 'mudanza' },
      ],
    },
    {
      id: 'property_type',
      label: '¿Qué tipo de inmueble?',
      type: 'radio',
      options: [
        { label: 'Apartamento', value: 'apartamento' },
        { label: 'Casa', value: 'casa' },
        { label: 'Oficina', value: 'oficina' },
        { label: 'Local comercial', value: 'local' },
      ],
    },
    {
      id: 'rooms',
      label: '¿Cuántas habitaciones tiene el espacio?',
      type: 'counter',
      options: [
        { label: '1-2', value: '1-2' },
        { label: '3-4', value: '3-4' },
        { label: '5+', value: '5+' },
      ],
    },
    {
      id: 'frequency',
      label: '¿Con qué frecuencia lo necesitas?',
      type: 'radio',
      options: [
        { label: 'Una sola vez', value: 'unica' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Quincenal', value: 'quincenal' },
        { label: 'Mensual', value: 'mensual' },
      ],
    },
  ],
};

const electricidad: ServiceQuestionSet = {
  categoryKeys: ['electricistas', 'electricidad', 'eléctrico', 'electrico'],
  title: 'Electricidad',
  questions: [
    {
      id: 'electrical_type',
      label: '¿Qué tipo de trabajo eléctrico necesitas?',
      type: 'radio',
      options: [
        { label: 'Instalación nueva', value: 'instalacion' },
        { label: 'Reparación', value: 'reparacion' },
        { label: 'Revisión / inspección', value: 'revision' },
        { label: 'Cambio de tablero', value: 'tablero' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'work_location',
      label: '¿Dónde es el trabajo?',
      type: 'radio',
      options: [
        { label: 'Interior (vivienda)', value: 'interior' },
        { label: 'Exterior', value: 'exterior' },
        { label: 'Comercial / oficina', value: 'comercial' },
      ],
    },
    {
      id: 'urgency',
      label: '¿Es una urgencia?',
      type: 'radio',
      options: [
        { label: 'Sí, urgente', value: 'urgente' },
        { label: 'No, puedo esperar', value: 'no_urgente' },
      ],
    },
  ],
};

const jardineria: ServiceQuestionSet = {
  categoryKeys: ['jardinería', 'jardineria', 'jardineros'],
  title: 'Jardinería',
  questions: [
    {
      id: 'garden_service',
      label: '¿Qué servicio de jardinería necesitas?',
      type: 'radio',
      options: [
        { label: 'Mantenimiento general', value: 'mantenimiento' },
        { label: 'Diseño de jardín', value: 'diseno' },
        { label: 'Poda de árboles', value: 'poda' },
        { label: 'Instalación de césped', value: 'cesped' },
        { label: 'Fumigación', value: 'fumigacion' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'area_size',
      label: '¿Cuál es el tamaño del área verde?',
      type: 'radio',
      options: [
        { label: 'Pequeño (menos de 50m²)', value: 'pequeno' },
        { label: 'Mediano (50 - 200m²)', value: 'mediano' },
        { label: 'Grande (más de 200m²)', value: 'grande' },
      ],
    },
    {
      id: 'frequency',
      label: '¿Con qué frecuencia lo necesitas?',
      type: 'radio',
      options: [
        { label: 'Una sola vez', value: 'unica' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Quincenal', value: 'quincenal' },
        { label: 'Mensual', value: 'mensual' },
      ],
    },
  ],
};

const carpinteria: ServiceQuestionSet = {
  categoryKeys: ['carpintería', 'carpinteria', 'carpinteros'],
  title: 'Carpintería',
  questions: [
    {
      id: 'carpentry_type',
      label: '¿Qué tipo de trabajo necesitas?',
      type: 'radio',
      options: [
        { label: 'Mueble a medida', value: 'mueble_medida' },
        { label: 'Reparación de mueble', value: 'reparacion' },
        { label: 'Instalación de puertas / ventanas', value: 'puertas' },
        { label: 'Montaje de muebles', value: 'montaje' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'quantity',
      label: '¿Cuántas piezas o unidades?',
      type: 'counter',
      options: [
        { label: '1', value: '1' },
        { label: '2-3', value: '2-3' },
        { label: '4-5', value: '4-5' },
        { label: 'Más de 5', value: '5+' },
      ],
    },
    {
      id: 'has_material',
      label: '¿Tienes el material?',
      type: 'radio',
      options: [
        { label: 'Sí', value: 'si' },
        { label: 'No, necesito que lo compren', value: 'no' },
      ],
    },
  ],
};

const mudanzas: ServiceQuestionSet = {
  categoryKeys: ['servicios de mudanza', 'mudanzas', 'mudanza'],
  title: 'Mudanzas',
  questions: [
    {
      id: 'move_type',
      label: '¿Qué tipo de mudanza?',
      type: 'radio',
      options: [
        { label: 'Local (misma ciudad)', value: 'local' },
        { label: 'Intercity (otra ciudad)', value: 'intercity' },
        { label: 'Solo carga / descarga', value: 'carga' },
      ],
    },
    {
      id: 'property_type',
      label: '¿Qué tipo de inmueble?',
      type: 'radio',
      options: [
        { label: 'Apartamento', value: 'apartamento' },
        { label: 'Casa', value: 'casa' },
        { label: 'Oficina', value: 'oficina' },
      ],
    },
    {
      id: 'rooms',
      label: '¿Cuántas habitaciones tienes?',
      type: 'counter',
      options: [
        { label: '1-2', value: '1-2' },
        { label: '3-4', value: '3-4' },
        { label: '5+', value: '5+' },
      ],
    },
    {
      id: 'packing',
      label: '¿Necesitas servicio de embalaje?',
      type: 'radio',
      options: [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' },
      ],
    },
  ],
};

const mascotas: ServiceQuestionSet = {
  categoryKeys: ['cuidado de mascotas', 'paseador de perros', 'mascotas'],
  title: 'Cuidado de mascotas',
  questions: [
    {
      id: 'pet_service',
      label: '¿Qué servicio necesitas?',
      type: 'radio',
      options: [
        { label: 'Paseo de perro', value: 'paseo' },
        { label: 'Cuidado en casa', value: 'cuidado' },
        { label: 'Guardería', value: 'guarderia' },
        { label: 'Entrenamiento', value: 'entrenamiento' },
        { label: 'Baño / peluquería', value: 'bano' },
      ],
    },
    {
      id: 'pet_type',
      label: '¿Qué tipo de mascota?',
      type: 'radio',
      options: [
        { label: 'Perro pequeño', value: 'perro_pequeno' },
        { label: 'Perro mediano', value: 'perro_mediano' },
        { label: 'Perro grande', value: 'perro_grande' },
        { label: 'Gato', value: 'gato' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'frequency',
      label: '¿Con qué frecuencia?',
      type: 'radio',
      options: [
        { label: 'Una sola vez', value: 'unica' },
        { label: 'Diario', value: 'diario' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Otro', value: 'otro' },
      ],
    },
  ],
};

const cuidadoPersonas: ServiceQuestionSet = {
  categoryKeys: ['cuidado de niños', 'cuidado de personas mayores'],
  title: 'Cuidado de personas',
  questions: [
    {
      id: 'care_type',
      label: '¿Qué tipo de cuidado necesitas?',
      type: 'radio',
      options: [
        { label: 'Cuidado diurno', value: 'diurno' },
        { label: 'Cuidado nocturno', value: 'nocturno' },
        { label: 'Tiempo completo', value: 'completo' },
        { label: 'Emergencia / puntual', value: 'emergencia' },
      ],
    },
    {
      id: 'people_count',
      label: '¿Cuántas personas requieren cuidado?',
      type: 'counter',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3+', value: '3+' },
      ],
    },
    {
      id: 'frequency',
      label: '¿Con qué frecuencia?',
      type: 'radio',
      options: [
        { label: 'Diario', value: 'diario' },
        { label: 'Algunos días por semana', value: 'parcial' },
        { label: 'Fines de semana', value: 'fines_semana' },
        { label: 'Una sola vez', value: 'unica' },
      ],
    },
  ],
};

const electrodomesticos: ServiceQuestionSet = {
  categoryKeys: ['reparación de electrodomésticos', 'electrodomésticos', 'electrodomesticos'],
  title: 'Reparación de electrodomésticos',
  questions: [
    {
      id: 'appliance',
      label: '¿Qué electrodoméstico necesitas reparar?',
      type: 'radio',
      options: [
        { label: 'Lavadora', value: 'lavadora' },
        { label: 'Refrigerador', value: 'refrigerador' },
        { label: 'Horno / cocina', value: 'horno' },
        { label: 'Aire acondicionado', value: 'aire' },
        { label: 'Lavavajillas', value: 'lavavajillas' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'problem',
      label: '¿Qué problema tiene?',
      type: 'radio',
      options: [
        { label: 'No enciende', value: 'no_enciende' },
        { label: 'Hace ruido extraño', value: 'ruido' },
        { label: 'Tiene fugas', value: 'fugas' },
        { label: 'No funciona correctamente', value: 'mal_funcionamiento' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'brand',
      label: '¿Conoces la marca?',
      type: 'text',
      placeholder: 'Ej: Samsung, LG, Whirlpool...',
    },
  ],
};

const legal: ServiceQuestionSet = {
  categoryKeys: ['servicios legales', 'asesoría fiscal', 'asesoria fiscal', 'legal'],
  title: 'Servicios Legales y Asesoría',
  questions: [
    {
      id: 'legal_type',
      label: '¿Qué tipo de asesoría necesitas?',
      type: 'radio',
      options: [
        { label: 'Constitución de empresa', value: 'empresa' },
        { label: 'Contratos', value: 'contratos' },
        { label: 'Laboral', value: 'laboral' },
        { label: 'Fiscal / tributaria', value: 'fiscal' },
        { label: 'Inmobiliaria', value: 'inmobiliaria' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'service_scope',
      label: '¿Es una consulta o un trámite?',
      type: 'radio',
      options: [
        { label: 'Solo consulta inicial', value: 'consulta' },
        { label: 'Necesito un trámite completo', value: 'tramite' },
      ],
    },
  ],
};

const mantenimiento: ServiceQuestionSet = {
  categoryKeys: ['mantenimiento preventivo', 'mantenimiento', 'manitas a domicilio'],
  title: 'Mantenimiento preventivo',
  questions: [
    {
      id: 'maintenance_type',
      label: '¿Qué tipo de mantenimiento?',
      type: 'radio',
      options: [
        { label: 'Eléctrico', value: 'electrico' },
        { label: 'Plomería', value: 'plomeria' },
        { label: 'Aire acondicionado / calefacción', value: 'climatizacion' },
        { label: 'General del hogar', value: 'general' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'frequency',
      label: '¿Con qué frecuencia lo necesitas?',
      type: 'radio',
      options: [
        { label: 'Una sola vez', value: 'unica' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Trimestral', value: 'trimestral' },
        { label: 'Semestral', value: 'semestral' },
      ],
    },
  ],
};

const fumigacion: ServiceQuestionSet = {
  categoryKeys: ['fumigación', 'fumigacion'],
  title: 'Fumigación',
  questions: [
    {
      id: 'pest_type',
      label: '¿Qué tipo de plaga?',
      type: 'radio',
      options: [
        { label: 'Cucarachas', value: 'cucarachas' },
        { label: 'Termitas', value: 'termitas' },
        { label: 'Roedores', value: 'roedores' },
        { label: 'Mosquitos', value: 'mosquitos' },
        { label: 'Hormigas', value: 'hormigas' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'property_type',
      label: '¿Qué tipo de inmueble?',
      type: 'radio',
      options: [
        { label: 'Casa', value: 'casa' },
        { label: 'Apartamento', value: 'apartamento' },
        { label: 'Oficina', value: 'oficina' },
        { label: 'Local comercial', value: 'local' },
        { label: 'Jardín / exterior', value: 'jardin' },
      ],
    },
    {
      id: 'area_size',
      label: '¿Cuál es el área aproximada?',
      type: 'radio',
      options: [
        { label: 'Menos de 50m²', value: 'menos_50' },
        { label: '50 - 100m²', value: '50_100' },
        { label: '100 - 200m²', value: '100_200' },
        { label: 'Más de 200m²', value: 'mas_200' },
      ],
    },
  ],
};

const pisos: ServiceQuestionSet = {
  categoryKeys: ['instalación de pisos', 'instalacion de pisos', 'diseño de interiores', 'diseno de interiores'],
  title: 'Pisos y Diseño de interiores',
  questions: [
    {
      id: 'floor_service',
      label: '¿Qué tipo de servicio?',
      type: 'radio',
      options: [
        { label: 'Instalación de piso nuevo', value: 'instalacion' },
        { label: 'Reparación de piso existente', value: 'reparacion' },
        { label: 'Diseño completo', value: 'diseno' },
        { label: 'Asesoría de decoración', value: 'asesoria' },
      ],
    },
    {
      id: 'material_type',
      label: '¿Qué tipo de piso / material?',
      type: 'radio',
      options: [
        { label: 'Porcelanato', value: 'porcelanato' },
        { label: 'Madera / parquet', value: 'madera' },
        { label: 'Vinilo', value: 'vinilo' },
        { label: 'Cerámica', value: 'ceramica' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      id: 'area_size',
      label: '¿Cuál es el área aproximada?',
      type: 'radio',
      options: [
        { label: 'Menos de 20m²', value: 'menos_20' },
        { label: '20 - 50m²', value: '20_50' },
        { label: '50 - 100m²', value: '50_100' },
        { label: 'Más de 100m²', value: 'mas_100' },
      ],
    },
  ],
};

// ── Master registry ──────────────────────────────────────────────────

const ALL_QUESTION_SETS: ServiceQuestionSet[] = [
  fontaneria,
  pintura,
  albanileria,
  limpieza,
  electricidad,
  jardineria,
  carpinteria,
  mudanzas,
  mascotas,
  cuidadoPersonas,
  electrodomesticos,
  legal,
  mantenimiento,
  fumigacion,
  pisos,
];

// ── Generic fallback ─────────────────────────────────────────────────

const genericQuestions: ServiceQuestionSet = {
  categoryKeys: [],
  title: 'Servicio',
  questions: [
    {
      id: 'service_description',
      label: '¿Qué tipo de servicio necesitas?',
      type: 'text',
      placeholder: 'Describe brevemente qué necesitas...',
    },
    {
      id: 'urgency',
      label: '¿Es urgente?',
      type: 'radio',
      options: [
        { label: 'Sí, lo antes posible', value: 'urgente' },
        { label: 'No, tengo flexibilidad', value: 'flexible' },
      ],
    },
  ],
};

// ── Lookup function ──────────────────────────────────────────────────

/**
 * Given a list of professional categories, returns the best matching
 * question set. Falls back to generic questions if no match is found.
 */
export function getQuestionsForCategories(categories: string[]): ServiceQuestionSet {
  if (!categories || categories.length === 0) return genericQuestions;

  const normalise = (s: string) => s.toLowerCase().trim();

  for (const cat of categories) {
    const key = normalise(cat);
    const match = ALL_QUESTION_SETS.find(qs =>
      qs.categoryKeys.some(k => normalise(k) === key || key.includes(normalise(k)))
    );
    if (match) return match;
  }

  return genericQuestions;
}
