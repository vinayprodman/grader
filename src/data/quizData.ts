import { Quiz } from '../contexts/QuizContext';

export const quizData: Quiz[] = [
  {
    id: "math-1",
    title: "Math Fundamentals",
    description: "Practice basic math operations and number sense concepts.",
    level: 3, // 3rd grade
    category: "Mathematics",
    icon: "🧮",
    duration: 5, // minutes
    price: "10",
    questions: [
      {
        id: 1,
        question: "What is 24 + 36?",
        options: {
          0: "50",
          1: "60",
          2: "70",
          3: "80"
        },
        answer_key: 1,
        explanation_correct: "That's right! 24 + 36 = 60. You added correctly!",
        explanation_wrong: "Not quite. 24 + 36 = 60. Try to add the ones place, then the tens place.",
        icon_correct: "🎯",
        icon_wrong: "🔢"
      },
      {
        id: 2,
        question: "Which number comes next in the pattern: 2, 4, 8, 16, __?",
        options: {
          0: "18",
          1: "24",
          2: "32",
          3: "64"
        },
        answer_key: 2,
        explanation_correct: "Perfect! In this pattern, each number is multiplied by 2. So 16 × 2 = 32.",
        explanation_wrong: "This pattern multiplies each number by 2. So 16 × 2 = 32.",
        icon_correct: "🌟",
        icon_wrong: "🤔"
      },
      {
        id: 3,
        question: "If I have 3 bags with 4 apples in each bag, how many apples do I have in total?",
        options: {
          0: "7",
          1: "8",
          2: "12",
          3: "16"
        },
        answer_key: 2,
        explanation_correct: "Yes! 3 bags × 4 apples = 12 apples in total. That's multiplication!",
        explanation_wrong: "When we have equal groups, we multiply. 3 bags × 4 apples = 12 apples.",
        icon_correct: "🍎",
        icon_wrong: "🍏"
      },
      {
        id: 4,
        question: "What is half of 18?",
        options: {
          0: "6",
          1: "8",
          2: "9",
          3: "10"
        },
        answer_key: 2,
        explanation_correct: "Great job! Half of 18 is 9 because 18 ÷ 2 = 9.",
        explanation_wrong: "Half means dividing by 2. Half of 18 is 18 ÷ 2 = 9.",
        icon_correct: "🎮",
        icon_wrong: "📊"
      },
      {
        id: 5,
        question: "How many minutes are in 2 hours?",
        options: {
          0: "60",
          1: "100",
          2: "120",
          3: "180"
        },
        answer_key: 2,
        explanation_correct: "Excellent! 1 hour has 60 minutes, so 2 hours has 2 × 60 = 120 minutes.",
        explanation_wrong: "Remember, 1 hour = 60 minutes. So 2 hours = 2 × 60 = 120 minutes.",
        icon_correct: "⏰",
        icon_wrong: "⌚"
      },
      {
        id: 6,
        question: "What is 7 × 8?",
        options: {
          0: "48",
          1: "54",
          2: "56",
          3: "64"
        },
        answer_key: 2,
        explanation_correct: "Perfect! 7 × 8 = 56. You're getting good at multiplication!",
        explanation_wrong: "The correct answer is 56. Try using skip counting: 8, 16, 24, 32, 40, 48, 56.",
        icon_correct: "🧠",
        icon_wrong: "📝"
      },
      {
        id: 7,
        question: "Which fraction is bigger: 1/2 or 1/4?",
        options: {
          0: "1/4",
          1: "1/2",
          2: "They are equal",
          3: "Can't compare"
        },
        answer_key: 1,
        explanation_correct: "Yes! 1/2 is bigger than 1/4. Think of a pizza - half is more than a quarter!",
        explanation_wrong: "When the top number (numerator) is the same, the smaller bottom number (denominator) makes a bigger fraction. So 1/2 is bigger than 1/4.",
        icon_correct: "🍕",
        icon_wrong: "📏"
      },
      {
        id: 8,
        question: "What is 45 - 17?",
        options: {
          0: "22",
          1: "27",
          2: "28",
          3: "32"
        },
        answer_key: 2,
        explanation_correct: "That's right! 45 - 17 = 28. Great subtraction skills!",
        explanation_wrong: "To subtract 17 from 45, you can do 45 - 10 = 35, then 35 - 7 = 28.",
        icon_correct: "🌈",
        icon_wrong: "🔢"
      },
      {
        id: 9,
        question: "How many sides does a pentagon have?",
        options: {
          0: "4",
          1: "5",
          2: "6",
          3: "8"
        },
        answer_key: 1,
        explanation_correct: "Excellent! A pentagon has 5 sides. 'Penta' means five!",
        explanation_wrong: "A pentagon has 5 sides. The prefix 'penta' means five, like in pentathlon.",
        icon_correct: "🔷",
        icon_wrong: "📐"
      },
      {
        id: 10,
        question: "What time is 4 hours after 9:30 AM?",
        options: {
          0: "1:30 AM",
          1: "1:30 PM",
          2: "12:30 PM",
          3: "4:30 PM"
        },
        answer_key: 1,
        explanation_correct: "Great! 4 hours after 9:30 AM is 1:30 PM. You're good with time!",
        explanation_wrong: "9:30 AM + 4 hours = 1:30 PM. Remember, after 12 noon, we switch to PM.",
        icon_correct: "⏱️",
        icon_wrong: "🕰️"
      }
    ]
  },
  {
    id: "science-1",
    title: "Science Explorer",
    description: "Discover the wonders of the natural world through fun science questions.",
    level: 3, // 3rd grade
    category: "Science",
    icon: "🔬",
    duration: 5, // minutes
    price: "10",
    questions: [
      {
        id: 1,
        question: "Which of these is NOT a state of matter?",
        options: {
          0: "Solid",
          1: "Liquid",
          2: "Energy",
          3: "Gas"
        },
        answer_key: 2,
        explanation_correct: "Correct! Energy is not a state of matter. The three main states of matter are solid, liquid, and gas.",
        explanation_wrong: "Energy is not a state of matter. The three main states of matter are solid, liquid, and gas.",
        icon_correct: "💫",
        icon_wrong: "❓"
      },
      {
        id: 2,
        question: "Which animal lays eggs?",
        options: {
          0: "Dog",
          1: "Cat",
          2: "Bird",
          3: "Rabbit"
        },
        answer_key: 2,
        explanation_correct: "Yes! Birds lay eggs. Most birds build nests to keep their eggs safe.",
        explanation_wrong: "Birds lay eggs. Dogs, cats, and rabbits give birth to live young.",
        icon_correct: "🐣",
        icon_wrong: "🐾"
      },
      {
        id: 3,
        question: "What do plants need to make their own food?",
        options: {
          0: "Milk and water",
          1: "Sunlight, air, and water",
          2: "Meat and vegetables",
          3: "Soil and insects"
        },
        answer_key: 1,
        explanation_correct: "That's right! Plants use sunlight, air (carbon dioxide), and water to make food through photosynthesis.",
        explanation_wrong: "Plants make their own food through photosynthesis using sunlight, air (carbon dioxide), and water.",
        icon_correct: "🌱",
        icon_wrong: "🌿"
      },
      {
        id: 4,
        question: "What is Earth's only natural satellite?",
        options: {
          0: "Sun",
          1: "Mars",
          2: "Moon",
          3: "Venus"
        },
        answer_key: 2,
        explanation_correct: "Excellent! The Moon is Earth's only natural satellite. It orbits around our planet.",
        explanation_wrong: "The Moon is Earth's only natural satellite. The Sun is a star, and Mars and Venus are other planets.",
        icon_correct: "🌙",
        icon_wrong: "🪐"
      },
      {
        id: 5,
        question: "Which force pulls objects toward the center of Earth?",
        options: {
          0: "Magnetism",
          1: "Electricity",
          2: "Friction",
          3: "Gravity"
        },
        answer_key: 3,
        explanation_correct: "Perfect! Gravity is the force that pulls objects toward Earth's center. It's why things fall down!",
        explanation_wrong: "Gravity is the force that pulls objects toward Earth's center, making things fall down.",
        icon_correct: "🍎",
        icon_wrong: "🧲"
      },
      {
        id: 6,
        question: "What do we call animals that eat both plants and other animals?",
        options: {
          0: "Herbivores",
          1: "Carnivores",
          2: "Omnivores",
          3: "Decomposers"
        },
        answer_key: 2,
        explanation_correct: "That's right! Omnivores eat both plants and animals. Humans are omnivores!",
        explanation_wrong: "Animals that eat both plants and other animals are called omnivores. Herbivores eat only plants, and carnivores eat only animals.",
        icon_correct: "🦊",
        icon_wrong: "🐮"
      },
      {
        id: 7,
        question: "Which part of a plant makes food using sunlight?",
        options: {
          0: "Roots",
          1: "Stems",
          2: "Flowers",
          3: "Leaves"
        },
        answer_key: 3,
        explanation_correct: "Yes! Leaves make food for the plant through photosynthesis using sunlight.",
        explanation_wrong: "Leaves make food for the plant through photosynthesis. Roots absorb water and nutrients, stems support the plant, and flowers help make seeds.",
        icon_correct: "🍃",
        icon_wrong: "🌸"
      },
      {
        id: 8,
        question: "What causes day and night on Earth?",
        options: {
          0: "Earth moving around the Sun",
          1: "Earth spinning on its axis",
          2: "The Moon blocking the Sun",
          3: "Clouds covering the Sun"
        },
        answer_key: 1,
        explanation_correct: "Great job! Earth spinning (rotating) on its axis causes day and night. It takes 24 hours for one complete spin!",
        explanation_wrong: "Earth spinning (rotating) on its axis causes day and night. It takes 24 hours for one complete rotation.",
        icon_correct: "🌍",
        icon_wrong: "🌗"
      },
      {
        id: 9,
        question: "Which sense organ helps you smell things?",
        options: {
          0: "Eyes",
          1: "Ears",
          2: "Nose",
          3: "Tongue"
        },
        answer_key: 2,
        explanation_correct: "Correct! Your nose helps you smell. It detects odors in the air.",
        explanation_wrong: "Your nose helps you smell. Eyes are for seeing, ears are for hearing, and tongue is for tasting.",
        icon_correct: "👃",
        icon_wrong: "👀"
      },
      {
        id: 10,
        question: "What does a thermometer measure?",
        options: {
          0: "Light",
          1: "Sound",
          2: "Weight",
          3: "Temperature"
        },
        answer_key: 3,
        explanation_correct: "That's right! A thermometer measures temperature - how hot or cold something is.",
        explanation_wrong: "A thermometer measures temperature - how hot or cold something is. We use it to check weather or body temperature.",
        icon_correct: "🌡️",
        icon_wrong: "⚖️"
      }
    ]
  },
  {
    id: "english-1",
    title: "English Adventures",
    description: "Boost your vocabulary and language skills with fun word challenges.",
    level: 2, // 2nd grade
    category: "English",
    icon: "📚",
    duration: 5, // minutes
    price: "10",
    questions: [
      {
        id: 1,
        question: "Which word is a synonym for 'happy'?",
        options: {
          0: "Sad",
          1: "Angry",
          2: "Joyful",
          3: "Tired"
        },
        answer_key: 2,
        explanation_correct: "Great job! 'Joyful' is another word for 'happy'. Synonyms are words with similar meanings.",
        explanation_wrong: "Synonyms are words with similar meanings. 'Joyful' is a synonym for 'happy'.",
        icon_correct: "😄",
        icon_wrong: "📖"
      },
      {
        id: 2,
        question: "Which word is spelled correctly?",
        options: {
          0: "Becuase",
          1: "Because",
          2: "Becouse",
          3: "Becawse"
        },
        answer_key: 1,
        explanation_correct: "Yes! 'Because' is spelled correctly. Good eye for spelling!",
        explanation_wrong: "The correct spelling is 'Because'. Remember: B-E-C-A-U-S-E.",
        icon_correct: "✅",
        icon_wrong: "📝"
      },
      {
        id: 3,
        question: "Which punctuation mark ends a question?",
        options: {
          0: "Period (.)",
          1: "Comma (,)",
          2: "Question mark (?)",
          3: "Exclamation point (!)"
        },
        answer_key: 2,
        explanation_correct: "That's right! A question mark (?) comes at the end of a question.",
        explanation_wrong: "Questions end with a question mark (?). Statements end with periods, and exclamations end with exclamation points.",
        icon_correct: "❓",
        icon_wrong: "❗"
      },
      {
        id: 4,
        question: "Which word is an antonym (opposite) of 'big'?",
        options: {
          0: "Large",
          1: "Small",
          2: "Huge",
          3: "Giant"
        },
        answer_key: 1,
        explanation_correct: "Perfect! 'Small' is the opposite of 'big'. Antonyms are words with opposite meanings.",
        explanation_wrong: "Antonyms are words with opposite meanings. 'Small' is the opposite of 'big'.",
        icon_correct: "🔍",
        icon_wrong: "📏"
      },
      {
        id: 5,
        question: "Which is a complete sentence?",
        options: {
          0: "Running in the park",
          1: "The blue car",
          2: "Under the table",
          3: "The dog barked loudly"
        },
        answer_key: 3,
        explanation_correct: "Yes! 'The dog barked loudly' is a complete sentence with a subject (dog) and a verb (barked).",
        explanation_wrong: "A complete sentence needs a subject and a verb. 'The dog barked loudly' is complete, while the others are phrases.",
        icon_correct: "🐕",
        icon_wrong: "📃"
      },
      {
        id: 6,
        question: "Which word should come first in alphabetical order?",
        options: {
          0: "Cat",
          1: "Apple",
          2: "Dog",
          3: "Banana"
        },
        answer_key: 1,
        explanation_correct: "Correct! 'Apple' comes first in alphabetical order (A, B, C, D).",
        explanation_wrong: "When putting words in alphabetical order, we look at the first letter. A comes before B, C, and D, so 'Apple' comes first.",
        icon_correct: "🔤",
        icon_wrong: "📚"
      },
      {
        id: 7,
        question: "A word that describes an action is called a:",
        options: {
          0: "Noun",
          1: "Verb",
          2: "Adjective",
          3: "Pronoun"
        },
        answer_key: 1,
        explanation_correct: "That's right! A verb is a word that describes an action, like run, jump, or write.",
        explanation_wrong: "Action words are called verbs. Examples include run, jump, eat, and write.",
        icon_correct: "🏃",
        icon_wrong: "🔠"
      },
      {
        id: 8,
        question: "Which word means the same as 'small'?",
        options: {
          0: "Tiny",
          1: "Huge",
          2: "Large",
          3: "Big"
        },
        answer_key: 0,
        explanation_correct: "Excellent! 'Tiny' is another word for 'small'. They are synonyms!",
        explanation_wrong: "'Tiny' means the same as 'small'. 'Huge', 'large', and 'big' all mean the opposite.",
        icon_correct: "🔎",
        icon_wrong: "📏"
      },
      {
        id: 9,
        question: "How many syllables are in the word 'elephant'?",
        options: {
          0: "2",
          1: "3",
          2: "4",
          3: "5"
        },
        answer_key: 1,
        explanation_correct: "Great job! 'Elephant' has 3 syllables: el-e-phant",
        explanation_wrong: "To count syllables, count the sound parts. 'Elephant' has 3 syllables: el-e-phant",
        icon_correct: "🐘",
        icon_wrong: "🔢"
      },
      {
        id: 10,
        question: "Which word is a plural noun?",
        options: {
          0: "Run",
          1: "Dog",
          2: "Books",
          3: "Happy"
        },
        answer_key: 2,
        explanation_correct: "Correct! 'Books' is a plural noun - it means more than one book.",
        explanation_wrong: "Plural nouns name more than one person, place, or thing. 'Books' is plural (more than one book).",
        icon_correct: "📚",
        icon_wrong: "📖"
      }
    ]
  },
  {
    id: "social-1",
    title: "Our World",
    description: "Learn about different places, people, and cultures around the world.",
    level: 4, // 4th grade
    category: "Social Studies",
    icon: "🌍",
    duration: 5, // minutes
    price: "10",
    questions: [
      {
        id: 1,
        question: "Which of these is NOT a continent?",
        options: {
          0: "Europe",
          1: "Asia",
          2: "Paris",
          3: "Africa"
        },
        answer_key: 2,
        explanation_correct: "Correct! Paris is a city in France, not a continent. The seven continents are Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
        explanation_wrong: "Paris is a city in France, not a continent. The continents include Africa, Asia, Europe, and others.",
        icon_correct: "🗺️",
        icon_wrong: "🏙️"
      },
      {
        id: 2,
        question: "What do we call people who study the past by looking at objects and buildings?",
        options: {
          0: "Geologists",
          1: "Archaeologists",
          2: "Biologists",
          3: "Astronomers"
        },
        answer_key: 1,
        explanation_correct: "Yes! Archaeologists study the past by examining artifacts and ruins.",
        explanation_wrong: "Archaeologists study human history through artifacts and ruins. Geologists study rocks, biologists study living things, and astronomers study space.",
        icon_correct: "🏺",
        icon_wrong: "🔭"
      },
      {
        id: 3,
        question: "Which of these is used to find directions?",
        options: {
          0: "Microscope",
          1: "Telescope",
          2: "Compass",
          3: "Thermometer"
        },
        answer_key: 2,
        explanation_correct: "That's right! A compass helps us find directions (north, south, east, and west).",
        explanation_wrong: "A compass helps us find directions. Microscopes magnify tiny things, telescopes view distant objects, and thermometers measure temperature.",
        icon_correct: "🧭",
        icon_wrong: "🔬"
      },
      {
        id: 4,
        question: "What is the capital city of India?",
        options: {
          0: "Mumbai",
          1: "New Delhi",
          2: "Kolkata",
          3: "Bangalore"
        },
        answer_key: 1,
        explanation_correct: "Perfect! New Delhi is the capital city of India.",
        explanation_wrong: "The capital city of India is New Delhi. Mumbai, Kolkata, and Bangalore are other major cities in India.",
        icon_correct: "🇮🇳",
        icon_wrong: "🏙️"
      },
      {
        id: 5,
        question: "Which form of transportation travels on tracks?",
        options: {
          0: "Car",
          1: "Airplane",
          2: "Boat",
          3: "Train"
        },
        answer_key: 3,
        explanation_correct: "Yes! Trains travel on railroad tracks.",
        explanation_wrong: "Trains travel on railroad tracks. Cars use roads, airplanes fly in the sky, and boats travel on water.",
        icon_correct: "🚂",
        icon_wrong: "🚗"
      },
      {
        id: 6,
        question: "Which of these is a natural resource?",
        options: {
          0: "Plastic",
          1: "Computer",
          2: "Water",
          3: "Car"
        },
        answer_key: 2,
        explanation_correct: "Correct! Water is a natural resource - it occurs naturally in our environment.",
        explanation_wrong: "Natural resources come from nature and aren't man-made. Water is natural, while plastic, computers, and cars are manufactured.",
        icon_correct: "💧",
        icon_wrong: "🖥️"
      },
      {
        id: 7,
        question: "What do we call the imaginary line that divides Earth into northern and southern halves?",
        options: {
          0: "Prime Meridian",
          1: "Equator",
          2: "Tropic of Cancer",
          3: "International Date Line"
        },
        answer_key: 1,
        explanation_correct: "That's right! The Equator is the imaginary line that circles Earth halfway between the North and South Poles.",
        explanation_wrong: "The Equator divides Earth into northern and southern hemispheres. The Prime Meridian divides it into eastern and western hemispheres.",
        icon_correct: "🌐",
        icon_wrong: "🧭"
      },
      {
        id: 8,
        question: "Which of these is NOT a type of community?",
        options: {
          0: "Urban",
          1: "Suburban",
          2: "Mountain",
          3: "Rural"
        },
        answer_key: 2,
        explanation_correct: "Great job! Urban, suburban, and rural are types of communities based on population density. Mountain describes a landform.",
        explanation_wrong: "The three main types of communities are urban (city), suburban (between city and country), and rural (country). Mountain is a landform, not a community type.",
        icon_correct: "🏙️",
        icon_wrong: "⛰️"
      },
      {
        id: 9,
        question: "What do people use to pay for goods and services?",
        options: {
          0: "Water",
          1: "Money",
          2: "Food",
          3: "Toys"
        },
        answer_key: 1,
        explanation_correct: "Correct! Money is used to pay for goods and services in an economy.",
        explanation_wrong: "In modern economies, money is used to pay for goods and services. This includes cash, coins, and digital payments.",
        icon_correct: "💵",
        icon_wrong: "🛒"
      },
      {
        id: 10,
        question: "What is the largest ocean on Earth?",
        options: {
          0: "Atlantic Ocean",
          1: "Indian Ocean",
          2: "Arctic Ocean",
          3: "Pacific Ocean"
        },
        answer_key: 3,
        explanation_correct: "Yes! The Pacific Ocean is the largest ocean on Earth. It covers about 30% of Earth's surface!",
        explanation_wrong: "The Pacific Ocean is the largest ocean on Earth. It's larger than all land areas combined!",
        icon_correct: "🌊",
        icon_wrong: "🗺️"
      }
    ]
  }
];