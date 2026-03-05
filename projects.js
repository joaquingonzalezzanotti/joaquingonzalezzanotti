export const projects = [
  {
    slug: "clinica-utn",
    title: "Clinica UTN",
    icon: "stethoscope",
    accent: "teal",
    oneLiner:
      "Proyecto academico de sistema de turnos medicos con gestion de pacientes, medicos y reportes.",
    problem:
      "La operacion de la clinica se resolvia de forma manual, con riesgo de superposiciones de agenda y baja trazabilidad de atenciones.",
    solution:
      "Implementacion de una app web en Flask con capas Modelo/DAO/Servicio para centralizar turnos, entidades clinicas y consultas sobre la base de datos.",
    features: [
      "Generacion de turnos por medico, mes y ano a partir de agendas configurables.",
      "ABM de pacientes, medicos y especialidades con validaciones de negocio.",
      "Reportes de turnos por especialidad, pacientes atendidos y turnos por medico en un periodo.",
      "Persistencia relacional con SQLite y consultas especificas para disponibilidad y estado de turnos."
    ],
    techStack: ["Python", "Flask", "SQLite", "HTML", "Bootstrap"],
    links: {
      github: "https://github.com/joaquingonzalezzanotti/TP-DAO.git",
      docs: "https://github.com/joaquingonzalezzanotti/TP-DAO/tree/master/Documentacion"
    },
    learnings: [
      "Separar DAO y servicios simplifica mantenimiento y evolucion de reglas de negocio.",
      "Definir restricciones de agenda desde el modelo reduce errores en asignacion de turnos.",
      "Los reportes operativos aportan visibilidad real sobre la calidad del servicio medico."
    ],
    image: null
  },
  {
    slug: "expense-log",
    title: "ExpenseLog",
    icon: "wallet",
    accent: "teal",
    oneLiner:
      "Plataforma para registro y analisis de gastos personales con reportes simples y accionables.",
    problem:
      "Muchos usuarios registran gastos en notas sueltas y pierden visibilidad de su flujo de caja mensual.",
    solution:
      "Construccion de una app full-stack con carga rapida de movimientos, clasificacion automatica basica y paneles de analitica financiera.",
    features: [
      "Registro de ingresos y egresos en segundos.",
      "Resumen mensual por categorias con filtros.",
      "Alertas visuales para detectar picos de gasto.",
      "Exportacion de historico para analisis externo."
    ],
    techStack: ["Go", "JavaScript", "PostgreSQL", "Docker"],
    links: {
      github: "https://github.com/joaquingonzalezzanotti",
      live: "https://expenselog.com.ar/"
    },
    learnings: [
      "Disenar modelos de datos simples acelera iteraciones de producto.",
      "Los dashboards deben priorizar legibilidad antes que cantidad de metricas.",
      "Pequenas mejoras en UX reducen friccion en tareas repetitivas."
    ],
    image: null
  },
  {
    slug: "sorty",
    title: "Sorty",
    icon: "sparkles",
    accent: "sky",
    oneLiner:
      "Aplicacion para organizar amigo invisible con una experiencia rapida, directa y sin friccion.",
    problem:
      "Los grupos grandes necesitaban evitar sorteos manuales con errores y reglas especiales sin soporte digital.",
    solution:
      "Desarrollo de una experiencia web guiada que automatiza emparejamientos, restricciones y notificaciones en minutos.",
    features: [
      "Creacion de eventos con reglas de exclusion por participante.",
      "Sorteo automatico con validaciones previas.",
      "Invitaciones simples por link compartible.",
      "Interfaz mobile-first para uso durante reuniones."
    ],
    techStack: ["JavaScript", "Python", "PostgreSQL", "Vercel"],
    links: {
      github: "https://github.com/joaquingonzalezzanotti",
      live: "https://sorty-neon.vercel.app"
    },
    learnings: [
      "Modelar reglas de negocio temprano evita retrabajo en algoritmos.",
      "Los flujos orientados a eventos requieren feedback continuo al usuario.",
      "Automatizar tests de casos borde es clave en sorteos con restricciones."
    ],
    image: null
  },
  {
    slug: "home-assistant",
    title: "Sistema de Automatizacion del Hogar (Home Assistant)",
    icon: "house",
    accent: "indigo",
    oneLiner:
      "Sistema centralizado para automatizar iluminacion, clima, seguridad y consumo energetico del hogar.",
    problem:
      "La vivienda tenia dispositivos inteligentes aislados en apps distintas, sin reglas unificadas ni monitoreo consolidado.",
    solution:
      "Implementacion de Home Assistant como hub local con integraciones IoT, automatizaciones por contexto y paneles personalizados por ambiente.",
    features: [
      "Automatizaciones por presencia, horario y sensores ambientales.",
      "Escenas inteligentes (Noche, Ausente, Trabajo, Relax).",
      "Monitoreo de energia en tiempo real con alertas de consumo.",
      "Panel responsive para control rapido desde mobile y desktop.",
      "Integracion de asistentes de voz y notificaciones push."
    ],
    techStack: ["Home Assistant", "YAML", "MQTT", "ESPHome", "Node-RED", "Docker"],
    links: {
      github: "https://github.com/joaquingonzalezzanotti"
    },
    learnings: [
      "La observabilidad de sensores mejora mucho la calidad de las automatizaciones.",
      "Separar reglas criticas de reglas de confort simplifica el mantenimiento.",
      "Priorizar procesamiento local mejora privacidad y resiliencia del sistema."
    ],
    image: null
  }
];
