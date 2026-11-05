# Usar una imagen de Node.js ligera
FROM node:18-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto que usa tu server.js
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
