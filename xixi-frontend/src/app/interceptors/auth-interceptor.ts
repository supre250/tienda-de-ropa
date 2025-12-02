// ------------------------------------------------------
// Interceptor HTTP para agregar el token JWT a cada
// petición saliente, si el usuario está logueado.
// ------------------------------------------------------
import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'xixi_token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    // Si no hay token, dejamos pasar la request tal cual
    return next(req);
  }

  // Clonamos la request y agregamos el header Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
