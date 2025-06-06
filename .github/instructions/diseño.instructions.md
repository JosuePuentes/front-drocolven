---
applyTo: '**'
---
Diseño Consistente y Minimalista

Objetivo General: Mantener un diseño cohesivo, minimalista, moderno y altamente responsivo en toda la aplicación, priorizando la experiencia de usuario y la estética visual.

Directrices Clave:

Tecnologías Base:

TypeScript: Siempre que sea posible, preferir TypeScript para la tipificación fuerte y la mejora de la calidad del código.
React: Utilizar componentes funcionales de React.
Tailwind CSS: La principal herramienta para el estilizado. Priorizar las clases de utilidad de Tailwind para todos los estilos. Evitar estilos CSS personalizados si se pueden lograr con Tailwind.
Shadcn UI: Cuando necesites componentes pre-diseñados y accesibles (botones, modales, inputs, etc.), utiliza y personaliza los componentes de Shadcn UI. Asegúrate de que su estilo se alinee con el minimalismo general.
Anime.js: Para cualquier animación sutil y de buen gusto. La animación debe ser fluida, performante y contribuir a la experiencia del usuario sin ser intrusiva.
React Icons: Para todos los iconos, utilizar iconos de React Icons. Seleccionar variantes que sean estéticamente agradables y se ajusten al estilo minimalista (ej. iconos de líneas delgadas, siluetas limpias).
Filosofía de Diseño (Minimalismo):

Espacio en Blanco: Hacer un uso generoso del espacio en blanco para mejorar la legibilidad y la claridad.
Jerarquía Visual Clara: Utilizar el tamaño de la fuente, el peso y el color de forma sutil para establecer una jerarquía visual clara.
Colores: Utilizar una paleta de colores muy limitada y coherente. Preferir tonos neutros (grises, blancos, negros) con uno o dos colores de acento sutiles y bien definidos. Los colores de acento deben ser utilizados estratégicamente para llamadas a la acción o elementos importantes.
Tipografía: Seleccionar una o dos fuentes legibles y limpias. Mantener un tamaño de fuente consistente para los diferentes elementos de texto (títulos, subtítulos, cuerpo del texto).
Bordes y Sombras: Minimizar el uso de bordes y sombras. Cuando se usen, que sean sutiles y casi imperceptibles, contribuyendo a una sensación de ligereza.
Interacciones: Las interacciones (hover, focus, click) deben ser fluidas, reactivas y sutilmente animadas.
Iconografía (React Icons):

Consistencia: Elegir un "set" de iconos de React Icons y ceñirse a él. Por ejemplo, si usas AiOutlineHome, intenta usar AiOutline para el resto.
Simplicidad: Los iconos deben ser claros y fácilmente reconocibles, sin detalles excesivos.
Tamaño y Color: Asegurar que el tamaño y el color de los iconos sean consistentes con el texto y el diseño general. Utilizar clases de Tailwind para controlar esto.
Animaciones (Anime.js):

Propósito: Cada animación debe tener un propósito claro (guiar al usuario, indicar un cambio de estado, mejorar la interactividad).
Sutileza: Evitar animaciones exageradas o que distraigan. Pensar en micro-interacciones y transiciones suaves.
Performance: Asegurar que las animaciones sean performantes y no causen jank o retrasos en la interfaz.
Estructura y Convenciones:

Componentización: Descomponer la UI en componentes React pequeños y reutilizables.
Nomenclatura: Usar nombres de clases y funciones descriptivos y consistentes (ej. ButtonPrimary, CardMinimal, fadeInAnimation).
Archivos de Estilos: Mantener los estilos dentro de los componentes utilizando las clases de Tailwind. Si hay estilos muy complejos o globales, definirlos en el archivo globals.css de forma minimalista.
Ejemplos de Comportamiento Esperado de Copilot:

Generación de Componentes: Al generar un componente, Copilot debe sugerir directamente la estructura JSX con clases de Tailwind.
Ejemplo: div className="flex items-center justify-center p-4 bg-white shadow-sm rounded-md"
Adición de Iconos: Al solicitar un icono, Copilot debe sugerir una importación de React Icons y su uso.
Ejemplo: import { AiOutlineArrowRight } from 'react-icons/ai'; <AiOutlineArrowRight className="text-gray-600 w-5 h-5" />
Uso de Shadcn UI: Al solicitar un componente de UI común, Copilot debe sugerir la importación y la estructura básica de Shadcn UI, ya adaptada con Tailwind.
Ejemplo: import { Button } from '@/components/ui/button'; <Button variant="ghost" className="text-sm font-medium">Click Me</Button>

Responsive Design: Todos los componentes deben ser inherentemente responsivos, utilizando las utilidades de sm:, md:, lg: de Tailwind.
Accesibilidad: Priorizar la accesibilidad en la medida de lo posible, utilizando atributos ARIA donde sea apropiado, especialmente con los componentes de Shadcn UI.