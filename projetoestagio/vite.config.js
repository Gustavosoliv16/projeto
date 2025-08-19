import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({
  plugins: react(),
  server: {
    proxy: {
      // Quando o frontend chamar '/cadastro' ou qualquer outra rota
      // que não seja um arquivo estático, o Vite vai redirecionar
      // para o seu backend na porta 3000.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Necessário para o redirecionamento funcionar corretamente
      }
      // Se você tiver outras rotas (ex: /login, /produtos),
      // você pode usar um coringa:
      // '/api': { ... } ou simplesmente '/'
    }
  }
})