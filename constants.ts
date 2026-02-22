
import { Language, Level } from "./types";

export const CHAPTER_NAMES: Record<number, { immersive: string }> = {
  0: { immersive: 'Foundations' }
};

export const MOCK_LEVELS: Level[] = [
  // --- ORIENTATION (Node 1-2) ---
  { id: '1', chapter: 0, title: 'Welcome', language: Language.GENERAL, description: 'Learn how to send a simple message.', objective: 'Type: "Hello World"', targetOutput: 'Hello World', difficulty: 'Easy', lesson: 'In programming, "Hello World" is the standard first step.' },
  { id: '2', chapter: 0, title: 'Ready State', language: Language.GENERAL, description: 'Check your system readiness.', objective: 'Type: "System Online"', targetOutput: 'System Online', difficulty: 'Easy', lesson: 'Verify that the terminal is accepting your input commands.' },

  // --- HTML (Node 3-12) ---
  { id: '3', chapter: 0, title: 'Introduction', language: Language.HTML, description: 'HTML is the standard markup language for Web pages.', objective: 'Create: <p>Hello HTML</p>', targetOutput: '<p>Hello HTML</p>', difficulty: 'Easy', lesson: 'The <p> tag is used for paragraphs.' },
  { id: '4', chapter: 0, title: 'Headings', language: Language.HTML, description: 'HTML headings are titles or subtitles that you want to display on a webpage.', objective: 'Create: <h1>My First Heading</h1>', targetOutput: '<h1>My First Heading</h1>', difficulty: 'Easy', lesson: 'H1 is the most important heading.' },
  { id: '5', chapter: 0, title: 'Links', language: Language.HTML, description: 'HTML links are defined with the <a> tag.', objective: 'Create: <a href="url">Link</a>', targetOutput: '<a href="url">Link</a>', difficulty: 'Easy', lesson: 'The href attribute specifies the destination.' },
  { id: '6', chapter: 0, title: 'Images', language: Language.HTML, description: 'HTML images are defined with the <img> tag.', objective: 'Create: <img src="logo.png">', targetOutput: '<img src="logo.png">', difficulty: 'Easy', lesson: 'The src attribute specifies the source file.' },
  { id: '7', chapter: 0, title: 'Lists', language: Language.HTML, description: 'The <ul> tag defines an unordered list.', objective: 'Create: <ul><li>Milk</li></ul>', targetOutput: '<ul><li>Milk</li></ul>', difficulty: 'Easy', lesson: 'LI tags represent list items.' },
  { id: '8', chapter: 0, title: 'Bold', language: Language.HTML, description: 'The HTML <b> element defines bold text.', objective: 'Create: <b>Important</b>', targetOutput: '<b>Important</b>', difficulty: 'Easy', lesson: 'Bold text is used for emphasis.' },
  { id: '9', chapter: 0, title: 'Italic', language: Language.HTML, description: 'The HTML <i> element defines italic text.', objective: 'Create: <i>Focus</i>', targetOutput: '<i>Focus</i>', difficulty: 'Easy', lesson: 'Italic text is used for soft emphasis.' },
  { id: '10', chapter: 0, title: 'Horizontal Rules', language: Language.HTML, description: 'The <hr> tag defines a thematic break.', objective: 'Create: <hr>', targetOutput: '<hr>', difficulty: 'Easy', lesson: 'HR is a self-closing tag.' },
  { id: '11', chapter: 0, title: 'Buttons', language: Language.HTML, description: 'HTML buttons are defined with the <button> tag.', objective: 'Create: <button>Click</button>', targetOutput: '<button>Click</button>', difficulty: 'Easy', lesson: 'Buttons are used for interactions.' },
  { id: '12', chapter: 0, title: 'Division', language: Language.HTML, description: 'The <div> tag is used as a container for HTML elements.', objective: 'Create: <div>Content</div>', targetOutput: '<div>Content</div>', difficulty: 'Easy', lesson: 'Divs help structure your page.' },

  // --- CSS (Node 13-22) ---
  { id: '13', chapter: 0, title: 'Colors', language: Language.CSS, description: 'CSS colors are used to style text.', objective: 'Set p to green.', targetOutput: 'p { color: green; }', difficulty: 'Easy', lesson: 'The color property defines text color.' },
  { id: '14', chapter: 0, title: 'Backgrounds', language: Language.CSS, description: 'The background-color property specifies the background color of an element.', objective: 'Set body bg to yellow.', targetOutput: 'body { background-color: yellow; }', difficulty: 'Easy', lesson: 'Use colors to fill backgrounds.' },
  { id: '15', chapter: 0, title: 'Fonts', language: Language.CSS, description: 'The font-size property sets the size of the text.', objective: 'Set p size to 18px.', targetOutput: 'p { font-size: 18px; }', difficulty: 'Easy', lesson: 'PX is a standard unit for size.' },
  { id: '16', chapter: 0, title: 'Alignment', language: Language.CSS, description: 'The text-align property is used to set the horizontal alignment of a text.', objective: 'Center h1 text.', targetOutput: 'h1 { text-align: center; }', difficulty: 'Easy', lesson: 'Values include left, right, center.' },
  { id: '17', chapter: 0, title: 'Borders', language: Language.CSS, description: 'The CSS border properties allow you to specify the style, width, and color of an element\'s border.', objective: 'Add 1px solid black border.', targetOutput: 'div { border: 1px solid black; }', difficulty: 'Easy', lesson: 'Borders wrap elements.' },
  { id: '18', chapter: 0, title: 'Padding', language: Language.CSS, description: 'Padding is used to create space around an element\'s content, inside of any defined borders.', objective: 'Add 20px padding.', targetOutput: 'div { padding: 20px; }', difficulty: 'Easy', lesson: 'Padding is internal space.' },
  { id: '19', chapter: 0, title: 'Margins', language: Language.CSS, description: 'Margins are used to create space around elements, outside of any defined borders.', objective: 'Add 20px margin.', targetOutput: 'div { margin: 20px; }', difficulty: 'Easy', lesson: 'Margin is external space.' },
  { id: '20', chapter: 0, title: 'Width', language: Language.CSS, description: 'The width property sets the width of an element.', objective: 'Set div width to 300px.', targetOutput: 'div { width: 300px; }', difficulty: 'Easy', lesson: 'Width limits horizontal size.' },
  { id: '21', chapter: 0, title: 'Height', language: Language.CSS, description: 'The height property sets the height of an element.', objective: 'Set div height to 100px.', targetOutput: 'div { height: 100px; }', difficulty: 'Easy', lesson: 'Height limits vertical size.' },
  { id: '22', chapter: 0, title: 'Radius', language: Language.CSS, description: 'The border-radius property is used to add rounded corners to an element.', objective: 'Add 10px radius.', targetOutput: 'div { border-radius: 10px; }', difficulty: 'Easy', lesson: 'Radius rounds off sharp corners.' },

  // --- JAVASCRIPT (Node 23-32) ---
  { id: '23', chapter: 0, title: 'Output', language: Language.JAVASCRIPT, description: 'JavaScript can "display" data in different ways.', objective: 'Call alert("JS").', targetOutput: 'alert("JS");', difficulty: 'Easy', lesson: 'Alert shows a simple popup.' },
  { id: '24', chapter: 0, title: 'Console', language: Language.JAVASCRIPT, description: 'The console.log() method writes a message to the console.', objective: 'Log "W3Schools".', targetOutput: 'console.log("W3Schools");', difficulty: 'Easy', lesson: 'Logging is essential for debugging.' },
  { id: '25', chapter: 0, title: 'Variables', language: Language.JAVASCRIPT, description: 'Variables are containers for storing data.', objective: 'Set price = 10.', targetOutput: 'let price = 10;', difficulty: 'Easy', lesson: 'Let declares a block-scoped variable.' },
  { id: '26', chapter: 0, title: 'Data Types', language: Language.JAVASCRIPT, description: 'JavaScript variables can hold different data types.', objective: 'Set name = "W3".', targetOutput: 'let name = "W3";', difficulty: 'Easy', lesson: 'Strings represent text data.' },
  { id: '27', chapter: 0, title: 'Arithmetic', language: Language.JAVASCRIPT, description: 'Arithmetic operators perform arithmetic on numbers.', objective: 'Calculate 5 * 2.', targetOutput: '5 * 2;', difficulty: 'Easy', lesson: 'Operators include +, -, *, /.' },
  { id: '28', chapter: 0, title: 'Comparison', language: Language.JAVASCRIPT, description: 'Comparison operators are used in logical statements to determine equality.', objective: 'Check 5 == 5.', targetOutput: '5 == 5;', difficulty: 'Easy', lesson: 'Booleans return true or false.' },
  { id: '29', chapter: 0, title: 'Functions', language: Language.JAVASCRIPT, description: 'A JavaScript function is a block of code designed to perform a particular task.', objective: 'Define function hi(){}.', targetOutput: 'function hi() {}', difficulty: 'Easy', lesson: 'Functions are reusable logic units.' },
  { id: '30', chapter: 0, title: 'Events', language: Language.JAVASCRIPT, description: 'HTML events are "things" that happen to HTML elements.', objective: 'Set onclick="run()".', targetOutput: 'onclick="run()"', difficulty: 'Easy', lesson: 'Events trigger JS code.' },
  { id: '31', chapter: 0, title: 'Comments', language: Language.JAVASCRIPT, description: 'JavaScript comments can be used to explain JavaScript code.', objective: 'Write // Note.', targetOutput: '// Note', difficulty: 'Easy', lesson: '// is for single line comments.' },
  { id: '32', chapter: 0, title: 'Arrays', language: Language.JAVASCRIPT, description: 'JavaScript arrays are used to store multiple values in a single variable.', objective: 'Create [1, 2, 3].', targetOutput: '[1, 2, 3];', difficulty: 'Easy', lesson: 'Arrays use square brackets.' },

  // --- JAVA (Node 33-42) ---
  { id: '33', chapter: 0, title: 'Introduction', language: Language.JAVA, description: 'Java is used for mobile apps, web apps, and much more.', objective: 'main method signature.', targetOutput: 'public static void main(String[] args) {}', difficulty: 'Medium', lesson: 'Execution begins in main.' },
  { id: '34', chapter: 0, title: 'Output', language: Language.JAVA, description: 'The println() method is used to print text.', objective: 'Print "Hello Java".', targetOutput: 'System.out.println("Hello Java");', difficulty: 'Easy', lesson: 'System.out is the output stream.' },
  { id: '35', chapter: 0, title: 'Variables', language: Language.JAVA, description: 'Java variables store data values.', objective: 'int myNum = 15;', targetOutput: 'int myNum = 15;', difficulty: 'Easy', lesson: 'Int holds whole numbers.' },
  { id: '36', chapter: 0, title: 'Strings', language: Language.JAVA, description: 'A String in Java is actually an object.', objective: 'String s = "Java";', targetOutput: 'String s = "Java";', difficulty: 'Easy', lesson: 'String starts with a capital S.' },
  { id: '37', chapter: 0, title: 'Booleans', language: Language.JAVA, description: 'A boolean data type is declared with the boolean keyword.', objective: 'boolean b = true;', targetOutput: 'boolean b = true;', difficulty: 'Easy', lesson: 'Java is strongly typed.' },
  { id: '38', chapter: 0, title: 'Math', language: Language.JAVA, description: 'The Java Math class has many methods.', objective: 'Call Math.max(5, 10).', targetOutput: 'Math.max(5, 10);', difficulty: 'Easy', lesson: 'Math methods are static.' },
  { id: '39', chapter: 0, title: 'Comments', language: Language.JAVA, description: 'Comments can be used to explain Java code.', objective: 'Write // Java.', targetOutput: '// Java', difficulty: 'Easy', lesson: 'Identical to JS comments.' },
  { id: '40', chapter: 0, title: 'Characters', language: Language.JAVA, description: 'The char data type is used to store a single character.', objective: 'char c = \'Z\';', targetOutput: 'char c = \'Z\';', difficulty: 'Easy', lesson: 'Chars use single quotes.' },
  { id: '41', chapter: 0, title: 'Final', language: Language.JAVA, description: 'The final keyword means the variable is unchangeable.', objective: 'final int x = 5;', targetOutput: 'final int x = 5;', difficulty: 'Easy', lesson: 'Final is for constants.' },
  { id: '42', chapter: 0, title: 'If Statements', language: Language.JAVA, description: 'Java supports the usual logical conditions from mathematics.', objective: 'if (x > y) {}.', targetOutput: 'if (x > y) {}', difficulty: 'Easy', lesson: 'Logic control flow.' },

  // --- C++ (Node 43-52) ---
  { id: '43', chapter: 0, title: 'Introduction', language: Language.CPP, description: 'C++ is a cross-platform language that can be used to create high-performance applications.', objective: 'int main() signature.', targetOutput: 'int main() { return 0; }', difficulty: 'Medium', lesson: 'Every C++ app needs main.' },
  { id: '44', chapter: 0, title: 'Output', language: Language.CPP, description: 'The cout object is used to output values/text.', objective: 'Output "Hello C++".', targetOutput: 'std::cout << "Hello C++";', difficulty: 'Easy', lesson: 'Cout is standard output stream.' },
  { id: '45', chapter: 0, title: 'Variables', language: Language.CPP, description: 'Variables are containers for storing data values.', objective: 'int myNum = 15;', targetOutput: 'int myNum = 15;', difficulty: 'Easy', lesson: 'Typed memory allocation.' },
  { id: '46', chapter: 0, title: 'User Input', language: Language.CPP, description: 'The cin object is used to get user input.', objective: 'Input into variable x.', targetOutput: 'std::cin >> x;', difficulty: 'Easy', lesson: 'Cin is for standard input.' },
  { id: '47', chapter: 0, title: 'New Line', language: Language.CPP, description: 'To insert a new line, you can use the \n character.', objective: 'Output \n.', targetOutput: 'std::cout << "\\n";', difficulty: 'Easy', lesson: 'Escape codes work in strings.' },
  { id: '48', chapter: 0, title: 'Namespaces', language: Language.CPP, description: 'A namespace is a region that provides a scope.', objective: 'using namespace std;.', targetOutput: 'using namespace std;', difficulty: 'Easy', lesson: 'Reduces verbosity of std::.' },
  { id: '49', chapter: 0, title: 'Strings', language: Language.CPP, description: 'Strings are used for storing text.', objective: 'string s = "C++";', targetOutput: 'string s = "C++";', difficulty: 'Easy', lesson: 'Needs <string> header.' },
  { id: '50', chapter: 0, title: 'Headers', language: Language.CPP, description: 'Headers contain definitions of functions and objects.', objective: '#include <iostream>.', targetOutput: '#include <iostream>', difficulty: 'Easy', lesson: 'Core I/O header.' },
  { id: '51', chapter: 0, title: 'Booleans', language: Language.CPP, description: 'A boolean data type is declared with the bool keyword.', objective: 'bool b = true;', targetOutput: 'bool b = true;', difficulty: 'Easy', lesson: 'Binary logic states.' },
  { id: '52', chapter: 0, title: 'Constants', language: Language.CPP, description: 'The const keyword makes a variable unchangeable.', objective: 'const int x = 1;', targetOutput: 'const int x = 1;', difficulty: 'Easy', lesson: 'Protects value integrity.' },
];

export const QUOTES = [
  "Learning to code is like learning a new superpower.",
  "Mistakes are just lessons in disguise.",
  "Practice makes perfect.",
  "Small steps lead to big projects.",
];

export const WORDS = ["HELLO", "WORLD", "PAGE", "SITE", "LINK", "TEXT", "BOX", "DATA", "START", "READY", "COLOR", "STYLE", "BOLD", "THICK", "THIN"];
export const COLORS = ["red", "blue", "green", "pink", "orange", "yellow", "purple", "white", "black", "gray"];
export const PROPS = ["color", "background-color", "border-color", "padding", "margin", "font-size", "font-weight", "display", "opacity"];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const DRILL_TEMPLATES: Record<Language, (difficulty: string) => { title: string, objective: string, target: string }> = {
  [Language.HTML]: (diff) => {
    const word = getRandom(WORDS);
    const tagsEasy = ['h1', 'p', 'b', 'i', 'span'];
    
    if (diff === 'Easy') {
      const tag = getRandom(tagsEasy);
      return { 
        title: `Task: Use <${tag}>`, 
        objective: `Make a <${tag}> tag with the word "${word}" inside.`, 
        target: `<${tag}>${word}</${tag}>` 
      };
    }
    return { 
      title: "Task: Link", 
      objective: `Make a link to "site.com" that says "${word}".`, 
      target: `<a href="https://site.com">${word}</a>` 
    };
  },
  [Language.CSS]: (diff) => {
    const color = getRandom(COLORS);
    const prop = getRandom(PROPS);
    const selector = getRandom(['div', 'p', 'h1']);
    
    return { 
      title: "Task: Styling", 
      objective: `Change the "${selector}" to have a "${prop}" of "${color}".`, 
      target: `${selector} { ${prop}: ${color}; }` 
    };
  },
  [Language.JAVASCRIPT]: (diff) => {
    const name = getRandom(WORDS).toLowerCase();
    const val = Math.floor(Math.random() * 100);
    return { 
      title: "Task: Variables", 
      objective: `Create a variable named "${name}" and set it to ${val}.`, 
      target: `let ${name} = ${val};` 
    };
  },
  [Language.CPP]: (diff) => {
    const val = Math.floor(Math.random() * 100);
    return { 
      title: "Task: C++ Variable", 
      objective: `Create an integer named "myNum" and set it to ${val}.`, 
      target: `int myNum = ${val};` 
    };
  },
  [Language.GENERAL]: (diff) => ({ title: "Intro Task", objective: "Type 'GO'", target: "GO" }),
  [Language.JAVA]: (diff) => ({ title: "Java Task", objective: "Print 'HELLO'", target: "HELLO" })
};

export const generateRandomDrill = (lang: Language, difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'): Level => {
  const gen = DRILL_TEMPLATES[lang] || DRILL_TEMPLATES[Language.HTML];
  const { title, objective, target } = gen(difficulty);
  
  return {
    id: `DRILL_${lang}_${Date.now()}`,
    chapter: 99,
    title,
    language: lang,
    description: objective,
    objective,
    targetOutput: target,
    difficulty,
    lesson: "Daily practice helps you remember the basics!"
  };
};

export const getTaskPoolSummary = () => {
    const summary: Record<string, any> = {};
    const languages = [Language.HTML, Language.CSS, Language.JAVASCRIPT, Language.CPP];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Extreme'];

    languages.forEach(lang => {
        summary[lang] = {};
        difficulties.forEach(diff => {
            const samples = [];
            const seen = new Set();
            for(let i=0; i<5; i++) {
                const s = DRILL_TEMPLATES[lang](diff);
                const key = s.objective;
                if(!seen.has(key)) {
                    samples.push(s);
                    seen.add(key);
                }
            }
            summary[lang][diff] = samples;
        });
    });
    return summary;
};
