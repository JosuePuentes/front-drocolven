---
applyTo: '**'
---

Contexto del Proyecto: Estás desarrollando una aplicación React utilizando TypeScript, con estilos definidos por Tailwind CSS. Los componentes de UI se gestionan con Shadcn UI, las animaciones se realizan con Anime.js, y los iconos provienen de React Icons. El objetivo es mantener un código limpio, performante y un diseño minimalista con iconos atractivos.

TypeScript: Siempre que sea posible, usa TypeScript para definir tipos e interfaces explícitas en props, estados, variables y retornos de funciones. La tipificación debe ser estricta.
React: Crea componentes funcionales utilizando los Hooks de React (useState, useEffect, useCallback, useMemo, useRef).
Diseño Minimalista:
Usa Tailwind CSS para todos los estilos. Prioriza las clases de utilidad sobre CSS personalizado.
Genera un diseño limpio con amplio espacio en blanco, jerarquía visual clara y una paleta de colores limitada (neutros con acentos sutiles).
Iconos: Utiliza React Icons. Elige iconos simples, de línea limpia que complementen el minimalismo (ej. de la familia AiOutline o similar).
Animaciones: Emplea Anime.js para animaciones sutiles, fluidas y con propósito. Evita efectos que distraigan o sean demasiado complejos.
Componentes UI: Utiliza y personaliza los componentes de Shadcn UI cuando necesites elementos comunes de interfaz de usuario (botones, modales, etc.). Asegúrate de que su estilo se alinee con Tailwind y el diseño general.
2. Guías Específicas de Implementación
Tipificación de Componentes (TypeScript):

Define interfaces para las props de cada componente.
Ejemplo: interface MiComponenteProps { titulo: string; activo?: boolean; onClick: (evento: React.MouseEvent<HTMLButtonElement>) => void; }
Tipifica explícitamente los estados usando useState.
Ejemplo: const [cargando, setCargando] = useState<boolean>(false);
Estilizado con Tailwind CSS:

Aplica las clases de Tailwind directamente en el JSX.
Ejemplo: <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
Para clases condicionales, usa template literals o clsx si la lógica es compleja.
Uso de Iconos (React Icons):

Importa el icono específico que necesites.
Asegúrate de que el tamaño y el color del icono sean consistentes con el texto circundante.
Ejemplo: import { AiOutlineHome } from 'react-icons/ai'; <AiOutlineHome className="w-6 h-6 mr-2 text-gray-700" />
Componentes Shadcn UI:

Al solicitar un componente de UI (ej. Button, Dialog), genera su importación y estructura básica.
Asegura que las variantes de Shadcn UI se integren visualmente con Tailwind.
Ejemplo: import { Button } from '@/components/ui/button'; <Button variant="outline" className="text-sm font-medium">Guardar</Button>

Animaciones con Anime.js:
Implementa animaciones ligeras y que mejoren la experiencia.
Asegúrate de que las dependencias de useEffect estén correctas.
Ejemplo: Uso de animejs para animar la opacidad y posición de un elemento, asegurando que el elemento esté disponible con useRef.
3. Optimización y Buenas Prácticas

Rendimiento: Considera React.memo, useCallback y useMemo para optimizar re-renderizaciones, pero solo cuando sea necesario para resolver problemas de rendimiento.
Accesibilidad: Prioriza elementos HTML semánticos. Con componentes Shadcn UI, asegúrate de que los atributos ARIA estén correctamente implementados.
Organización: Mantén la lógica y los tipos de un componente en el mismo archivo (.tsx) o en la misma carpeta.