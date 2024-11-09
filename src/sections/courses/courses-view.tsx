import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Divider } from '@mui/material';

// Tipo para representar un curso
type Course = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  startDate: string;
  rating: number;
  reviews: string;
  image: string;
  bgColor: string;
  syllabus: string[];
  video: string;
};

// Datos de ejemplo para los cursos
const courses = [
  {
    id: 1,
    title: "Formalización y Cumplimiento Legal en el Sector Agroquímico",
    description: "Conoce las normativas y procesos legales para operar en el sector agroquímico.",
    tags: ["Legal", "Agroquímico"],
    startDate: "May 10",
    rating: 4.5,
    reviews: "15,200",
    image: "/assets/images/course/curso1.png",
    bgColor: "#d6f4f1",
    syllabus: [
      "Requisitos legales para la formalización",
      "Normativa ambiental y de salud",
      "Licencias y permisos obligatorios",
      "Casos prácticos de cumplimiento legal",
    ],
    video: "https://www.youtube.com/embed/sTaTt-nl1vY", // Video relacionado al tema
  },
  {
    id: 2,
    title: "Inteligencia de Negocios para PYMES",
    description: "Descubre cómo usar datos y herramientas para mejorar la toma de decisiones en PYMES.",
    tags: ["PYMES", "Negocios"],
    startDate: "May 15",
    rating: 4.8,
    reviews: "22,300",
    image: "/assets/images/course/curso2.png",
    bgColor: "#e8dbf1",
    syllabus: [
      "Introducción a la inteligencia de negocios",
      "Herramientas de análisis de datos",
      "Interpretación de dashboards",
      "Estrategias para la toma de decisiones basadas en datos",
    ],
    video: "https://www.youtube.com/embed/3yQ4OLUsNwc", // Video actualizado para inteligencia de negocios
  },
  {
    id: 3,
    title: "Marketing y Ventas para Empresas de Agroquímicos",
    description: "Aprende estrategias efectivas para comercializar productos agroquímicos.",
    tags: ["Marketing", "Ventas"],
    startDate: "May 20",
    rating: 4.7,
    reviews: "18,900",
    image: "/assets/images/course/curso3.png",
    bgColor: "#fdeacc",
    syllabus: [
      "Segmentación de mercado en el sector agroquímico",
      "Estrategias de marketing digital",
      "Gestión del ciclo de ventas",
      "Fidelización de clientes",
    ],
    video: "https://www.youtube.com/embed/fOGstfMY0So", // Video sobre marketing y ventas
  },
  {
    id: 4,
    title: "Uso de CRM para Maximizar la Productividad",
    description: "Optimiza la gestión de clientes y procesos con un CRM adecuado.",
    tags: ["CRM", "Productividad"],
    startDate: "May 25",
    rating: 5.0,
    reviews: "30,000",
    image: "/assets/images/course/curso4.png",
    bgColor: "#d8e8ff",
    syllabus: [
      "Introducción al uso de CRM",
      "Automatización de tareas",
      "Gestión de bases de datos de clientes",
      "Medición de productividad con herramientas de CRM",
    ],
    video: "https://www.youtube.com/embed/NmCcj5iuNUI", // Video sobre estrategia de CRM
  },
  {
    id: 5,
    title: "Planificación de la Demanda y Gestión de Compras",
    description: "Domina las mejores prácticas en gestión de compras y planificación de la demanda.",
    tags: ["Gestión", "Compras"],
    startDate: "May 30",
    rating: 4.9,
    reviews: "25,400",
    image: "/assets/images/course/curso5.png",
    bgColor: "#fbe4d6",
    syllabus: [
      "Análisis de la demanda en mercados agrícolas",
      "Gestión eficiente de inventarios",
      "Optimización del proceso de compras",
      "Uso de herramientas para pronósticos de demanda",
    ],
    video: "https://www.youtube.com/embed/FwbysuNMLNc", // Video sobre planificación y gestión de compras
  },
];

export function CoursesView() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Estado con tipo explícito

  if (selectedCourse) {
    // Vista de detalles del curso
    return (
      <Box sx={{ padding: 3 }}>
        {/* Botón de regreso */}
        <Typography
          onClick={() => setSelectedCourse(null)}
          sx={{
            cursor: "pointer",
            color: "primary.main",
            marginBottom: 3,
            fontWeight: "bold",
          }}
        >
          ← Regresar a Cursos
        </Typography>

        {/* Video del curso */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            {selectedCourse.title} Video
          </Typography>
          <Box
            component="iframe"
            src={selectedCourse.video}
            title="Course Video"
            sx={{ width: "100%", height: "400px", borderRadius: 2 }}
          />
        </Box>

        {/* Sílabo del curso */}
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Sílabo
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Box>
          {selectedCourse.syllabus.map((item, index) => (
            <Typography key={index} variant="body1" sx={{ marginBottom: 1 }}>
              {index + 1}. {item}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  }

  // Vista de lista de cursos
  return (
    <Box sx={{ padding: 3 }}>
      {/* Título */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Mis Cursos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora tus cursos activos, próximos y completados
        </Typography>
      </Box>

      {/* Lista de cursos */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} key={course.id}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                backgroundColor: course.bgColor,
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => setSelectedCourse(course)} // Selección del curso
            >
              {/* Imagen a la izquierda */}
              <Box
                component="img"
                src={course.image}
                alt={course.title}
                sx={{
                  width: 220,
                  height: 120,
                  borderRadius: 2,
                  objectFit: "cover",
                  marginRight: 2,
                }}
              />
              {/* Contenido */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ margin: "8px 0" }}>
                  {course.description}
                </Typography>
                {/* Etiquetas */}
                <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
                  {course.tags.map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                  ))}
                </Stack>
                {/* Fecha y Rating */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2">
                    Start: <strong>{course.startDate}</strong>
                  </Typography>
                  <Typography variant="body2">
                    ⭐ {course.rating} ({course.reviews} ratings)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CoursesView;
