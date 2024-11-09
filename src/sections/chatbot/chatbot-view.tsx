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
import ReactTypingEffect from 'react-typing-effect';

// Define el tipo de los elementos del historial
type HistorialItem = {
  tipo: 'pregunta' | 'respuesta';
  texto: string;
};

// Función para realizar la consulta a la APIs
// Función para consultar la API y procesar la respuesta
async function query(data: Record<string, string>): Promise<string> {
  try {
    const response = await fetch(
      'https://api.stack-ai.com/inference/v0/run/1cdaa2ca-86d1-408e-b311-af8274d55d9c/672f6cff7c797a2d36e920a1',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 46c4878c-4945-4237-9a03-9370eeab5ef7',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    // Procesa y retorna la respuesta limpia
    return procesarRespuesta(result.outputs?.['out-0'] || 'No se recibió respuesta de la API');
  } catch (error: any) {
    console.error('Error al consultar la API:', error);
    throw new Error('Error al obtener la respuesta. Por favor, inténtalo nuevamente.');
  }
}


export function ChatbotView() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [pregunta, setPregunta] = useState('');
  const [loading, setLoading] = useState(false);

// Función para procesar la respuesta y eliminar contenido no deseado
function procesarRespuesta(respuesta: string): string {
  // Elimina cualquier contenido dentro de etiquetas "<citations>"
  respuesta = respuesta.replace(/<citations>.*?<\/citations>/g, '');
  // Elimina referencias como "[^0.1.0]"
  respuesta = respuesta.replace(/\[\^[^\]]*\]/g, '');
  // Elimina otros metadatos no deseados (opcional)
  respuesta = respuesta.replace(/Title:.*Content:.*/g, '');
  // Retorna la respuesta limpia
  return respuesta.trim();
}

// Modifica la función de manejo para usar este procesamiento
async function query(data: Record<string, string>): Promise<string> {
  try {
    const response = await fetch(
      'https://api.stack-ai.com/inference/v0/run/1cdaa2ca-86d1-408e-b311-af8274d55d9c/672f6cff7c797a2d36e920a1',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 46c4878c-4945-4237-9a03-9370eeab5ef7',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    // Procesa la respuesta recibida
    return procesarRespuesta(result.outputs?.['out-1'] || 'No se recibió respuesta de la API');
  } catch (error: any) {
    console.error('Error al consultar la API:', error);
    throw new Error('Error al obtener la respuesta. Por favor, inténtalo nuevamente.');
  }
}


  const handleSendClick = async () => {
    if (!pregunta.trim()) return;
  
    const nuevaPregunta: HistorialItem = { tipo: 'pregunta', texto: pregunta };
    setHistorial((prevHistorial) => [...prevHistorial, nuevaPregunta]);
    setLoading(true);
  
    try {
      // Llama a la API y procesa la respuesta
      const respuestaProcesada = await query({
        'in-0': pregunta,
        user_id: 'germanmp1002@gmail.com',
      });
  
      const nuevaRespuesta: HistorialItem = { tipo: 'respuesta', texto: respuestaProcesada };
      setHistorial((prevHistorial) => [...prevHistorial, nuevaRespuesta]);
    } catch (error: any) {
      const errorRespuesta: HistorialItem = {
        tipo: 'respuesta',
        texto: error.message || 'Hubo un error al obtener la respuesta.',
      };
      setHistorial((prevHistorial) => [...prevHistorial, errorRespuesta]);
    } finally {
      setLoading(false);
      setPregunta('');
    }
  };
  

  return (
    <Container sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
      >
        Chatbot Asistente
      </Typography>

      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
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
                  {item.tipo === 'respuesta' ? (
                    <ReactTypingEffect
                      text={item.texto}
                      speed={30}
                      eraseDelay={999999}
                      typingDelay={0}
                      cursor=" "
                    />
                  ) : (
                    item.texto
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>

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
    </Container>
  );
}
