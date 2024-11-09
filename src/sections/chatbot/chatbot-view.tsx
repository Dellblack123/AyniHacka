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

  // Respuestas predefinidas como respaldo
  const respuestasPredefinidas: Record<string, string> = {
    hola: '¡Hola! ¿En qué puedo ayudarte?',
    ayuda: 'Claro, estoy aquí para ayudarte. Por favor, dime más.',
    tiempo: 'Actualmente no tengo información del clima. ¡Pronto podré ayudarte con eso!',
    default: 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla?',
  };

  // Función para procesar las respuestas recibidas de la API
  const procesarRespuesta = (respuesta: string): string => {
    // Aquí puedes agregar lógica para ajustar o filtrar la respuesta según tus necesidades
    return respuesta.trim() || respuestasPredefinidas.default;
  };

  const handleSendClick = async () => {
    if (!pregunta.trim()) return;

    const nuevaPregunta: HistorialItem = { tipo: 'pregunta', texto: pregunta };
    setHistorial((prevHistorial) => [...prevHistorial, nuevaPregunta]);
    setLoading(true);

    try {
      // Llamada a la API
      const response = await fetch(
        'https://www.stack-ai.com/form/1cdaa2ca-86d1-408e-b311-af8274d55d9c/46c4878c-4945-4237-9a03-9370eeab5ef7/672f6cff7c797a2d36e920a1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 563769f1-0408-4543-9178-1be60f8cfac3',
          },
          body: JSON.stringify({ 
            'in-0': pregunta, 
            user_id: 'rubendotru@gmail.com' 
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al conectar con la API');
      }

      const data = await response.json();
      const respuestaOriginal = data.outputs?.['out-1'] || respuestasPredefinidas.default;
      const respuestaProcesada = procesarRespuesta(respuestaOriginal);

      const nuevaRespuesta: HistorialItem = { tipo: 'respuesta', texto: respuestaProcesada };
      setHistorial((prevHistorial) => [...prevHistorial, nuevaRespuesta]);
    } catch (error) {
      console.error('Error al obtener la respuesta de la API:', error);
      const errorRespuesta: HistorialItem = {
        tipo: 'respuesta',
        texto: 'Hubo un error al obtener la respuesta. Por favor, inténtalo nuevamente.',
      };
      setHistorial((prevHistorial) => [...prevHistorial, errorRespuesta]);
    } finally {
      setLoading(false);
      setPregunta('');
    }
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
