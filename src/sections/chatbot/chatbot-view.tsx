import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Card,
} from '@mui/material';

// Define el tipo de los elementos del historial
type HistorialItem = {
  tipo: 'pregunta' | 'respuesta';
  texto: string;
};

export function ChatbotView() {
  // Define el tipo del estado del historial
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [pregunta, setPregunta] = useState('');
  const [loading, setLoading] = useState(false);

  const respuestasPredefinidas: Record<string, string> = {
    hola: '¡Hola! ¿En qué puedo ayudarte?',
    ayuda: 'Claro, estoy aquí para ayudarte. Por favor, dime más.',
    tiempo: 'Actualmente no tengo información del clima. ¡Pronto podré ayudarte con eso!',
    default: 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla?',
  };
  

  const handleSendClick = () => {
    if (!pregunta.trim()) return;

    const nuevaPregunta: HistorialItem = { tipo: 'pregunta', texto: pregunta };
    setHistorial((prev) => [...prev, nuevaPregunta]);
    setPregunta('');
    setLoading(true);

    setTimeout(() => {
      const preguntaNormalizada = pregunta.trim().toLowerCase();
      const respuesta =
        respuestasPredefinidas[preguntaNormalizada] || respuestasPredefinidas.default;

      const nuevaRespuesta: HistorialItem = { tipo: 'respuesta', texto: respuesta };
      setHistorial((prev) => [...prev, nuevaRespuesta]);
      setLoading(false);
    }, 500);
  };

  return (
    <Container sx={{ mt: 5 }}>
      {/* Título */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
      >
        Chatbot Asistente
      </Typography>

      {/* Chat Container */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        {/* Historial de Chat */}
        <Paper
          sx={{
            p: 2,
            height: 'calc(60vh - 100px)',
            overflowY: 'auto',
            borderRadius: 2,
            mb: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <List>
            {historial.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: item.tipo === 'pregunta' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: item.tipo === 'pregunta' ? '#d0eaff' : '#e8f5e9',
                    color: 'text.primary',
                    borderRadius: 2,
                    p: 1.5,
                    maxWidth: '70%',
                    textAlign: 'left',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {item.texto}
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Input de Pregunta */}
        <Box display="flex" gap={2}>
          <TextField
            placeholder="Escribe tu pregunta..."
            fullWidth
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{
              bgcolor: 'white',
              borderRadius: 1,
              '& fieldset': { border: 'none' },
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Button
            onClick={handleSendClick}
            disabled={loading || !pregunta.trim()}
            variant="contained"
            sx={{
              minWidth: '56px',
              height: '56px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 1,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            &gt;
          </Button>
        </Box>
      </Card>

      {/* Botón de Soporte */}
      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{
          mt: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
        onClick={() =>
          window.open(
            'https://api.whatsapp.com/send?phone=51960252970&text=Hola,%20necesito%20ayuda',
            '_blank'
          )
        }
      >
        Contactar soporte
      </Button>
    </Container>
  );
}
