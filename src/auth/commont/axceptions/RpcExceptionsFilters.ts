import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionsFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Obtener detalles del error
    const errorResponse = exception.getError();
 
    const status = (errorResponse as any)?.status ?? 500;
    const message = (errorResponse as any)?.message ?? 'Internal Server Error';

    console.error('🚨 RPC Exception Filter:', JSON.stringify(errorResponse, null, 2));

    // Enviar respuesta HTTP
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
