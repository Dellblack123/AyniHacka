import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

// Define el tipo de errores para TypeScript
type Errors = {
  ruc?: string;
  companyName?: string;
  email?: string;
  password?: string;
  cellphone?: string;
};

// ----------------------------------------------------------------------

export function RegisterView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [ruc, setRuc] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleRegisterUser = useCallback(async () => {
    // Validar campos vacíos
    const newErrors: Errors = {};
    if (!ruc) newErrors.ruc = 'Completa el campo';
    if (!companyName) newErrors.companyName = 'Completa el campo';
    if (!email) newErrors.email = 'Completa el campo';
    if (!password) newErrors.password = 'Completa el campo';
    if (!cellphone) newErrors.cellphone = 'Completa el campo';

    setErrors(newErrors);

    // Si hay errores, detener el registro
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post('https://backend-ayni.azurewebsites.net/api/user/register', {
        ruc,
        companyName,
        email,
        password,
        cellphone,
      });

      if (response.status === 201) {
        router.push('/');
      } else {
        alert('Error al registrarse. Por favor, verifica los datos ingresados.');
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Error al registrarse. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [ruc, companyName, email, password, cellphone, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="ruc"
        label="RUC"
        value={ruc}
        onChange={(e) => setRuc(e.target.value)}
        error={!!errors.ruc}
        helperText={errors.ruc}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="companyName"
        label="Nombre de la Empresa"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        error={!!errors.companyName}
        helperText={errors.companyName}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="email"
        label="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="cellphone"
        label="Celular"
        value={cellphone}
        onChange={(e) => setCellphone(e.target.value)}
        error={!!errors.cellphone}
        helperText={errors.cellphone}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegisterUser}
        loading={loading}
      >
        Registrarse
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Regístrate</Typography>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tienes una cuenta?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push('/')}>
            Inicia sesión
          </Link>
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}
