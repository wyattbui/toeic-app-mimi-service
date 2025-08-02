import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create TOEIC Parts
  const parts = [
    {
      partNumber: 1,
      name: 'Photographs',
      description: 'Look at the picture and choose the best description',
      skillType: 'Listening'
    },
    {
      partNumber: 2, 
      name: 'Question-Response',
      description: 'Listen to a question and choose the best response',
      skillType: 'Listening'
    },
    {
      partNumber: 3,
      name: 'Conversations',
      description: 'Listen to conversations and answer questions',
      skillType: 'Listening'
    },
    {
      partNumber: 4,
      name: 'Short Talks',
      description: 'Listen to short talks and answer questions',
      skillType: 'Listening'
    },
    {
      partNumber: 5,
      name: 'Incomplete Sentences',
      description: 'Complete the sentences with the best word',
      skillType: 'Reading'
    },
    {
      partNumber: 6,
      name: 'Text Completion',
      description: 'Complete the texts with the best words',
      skillType: 'Reading'
    },
    {
      partNumber: 7,
      name: 'Reading Comprehension',
      description: 'Read passages and answer questions',
      skillType: 'Reading'
    }
  ];

  console.log('📝 Creating parts...');
  for (const partData of parts) {
    await prisma.part.upsert({
      where: { partNumber: partData.partNumber },
      update: {},
      create: partData
    });
  }

  // Helper function to create questions
  async function createQuestion(partId: number, questionData: any, difficulty: string, questionType: string, explanation: string) {
    await prisma.question.create({
      data: {
        partId,
        questionText: questionData.questionText,
        questionType,
        difficulty,
        explanation,
        audioUrl: questionData.audioUrl,
        imageUrl: questionData.imageUrl,
        passageText: questionData.passageText,
        passageTitle: questionData.passageTitle,
        options: {
          create: questionData.options
        }
      }
    });
  }

  // Seed Part 1 - Photographs (with images and audio)
  console.log('🖼️ Creating Part 1 questions (Photographs)...');
  const part1Questions = [
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=500",
      audioUrl: "/audio/part1/question1.mp3",
      options: [
        { optionLetter: "A", optionText: "A woman is typing on a computer.", isCorrect: true },
        { optionLetter: "B", optionText: "A woman is talking on the phone.", isCorrect: false },
        { optionLetter: "C", optionText: "A woman is reading a book.", isCorrect: false },
        { optionLetter: "D", optionText: "A woman is drinking coffee.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500",
      audioUrl: "/audio/part1/question2.mp3",
      options: [
        { optionLetter: "A", optionText: "People are sitting in a meeting room.", isCorrect: false },
        { optionLetter: "B", optionText: "People are having lunch.", isCorrect: false },
        { optionLetter: "C", optionText: "People are working at their desks.", isCorrect: true },
        { optionLetter: "D", optionText: "People are standing in line.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
      audioUrl: "/audio/part1/question3.mp3",
      options: [
        { optionLetter: "A", optionText: "A man is driving a car.", isCorrect: false },
        { optionLetter: "B", optionText: "A man is fixing a car.", isCorrect: true },
        { optionLetter: "C", optionText: "A man is washing a car.", isCorrect: false },
        { optionLetter: "D", optionText: "A man is buying a car.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      audioUrl: "/audio/part1/question4.mp3",
      options: [
        { optionLetter: "A", optionText: "A woman is cooking in the kitchen.", isCorrect: false },
        { optionLetter: "B", optionText: "A woman is shopping for groceries.", isCorrect: true },
        { optionLetter: "C", optionText: "A woman is eating at a restaurant.", isCorrect: false },
        { optionLetter: "D", optionText: "A woman is cleaning the house.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500",
      audioUrl: "/audio/part1/question5.mp3",
      options: [
        { optionLetter: "A", optionText: "Students are taking an exam.", isCorrect: false },
        { optionLetter: "B", optionText: "Students are having a discussion.", isCorrect: true },
        { optionLetter: "C", optionText: "Students are eating lunch.", isCorrect: false },
        { optionLetter: "D", optionText: "Students are playing sports.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500",
      audioUrl: "/audio/part1/question6.mp3",
      options: [
        { optionLetter: "A", optionText: "A doctor is examining a patient.", isCorrect: true },
        { optionLetter: "B", optionText: "A teacher is helping a student.", isCorrect: false },
        { optionLetter: "C", optionText: "A manager is meeting with an employee.", isCorrect: false },
        { optionLetter: "D", optionText: "A customer is talking to a salesperson.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68e2c54544?w=500",
      audioUrl: "/audio/part1/question7.mp3",
      options: [
        { optionLetter: "A", optionText: "A woman is reading a magazine.", isCorrect: false },
        { optionLetter: "B", optionText: "A woman is writing in a notebook.", isCorrect: false },
        { optionLetter: "C", optionText: "A woman is working on a laptop.", isCorrect: true },
        { optionLetter: "D", optionText: "A woman is making a phone call.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500",
      audioUrl: "/audio/part1/question8.mp3",
      options: [
        { optionLetter: "A", optionText: "Workers are building a house.", isCorrect: true },
        { optionLetter: "B", optionText: "Workers are painting a wall.", isCorrect: false },
        { optionLetter: "C", optionText: "Workers are cleaning windows.", isCorrect: false },
        { optionLetter: "D", optionText: "Workers are moving furniture.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      audioUrl: "/audio/part1/question9.mp3",
      options: [
        { optionLetter: "A", optionText: "Customers are waiting in line.", isCorrect: false },
        { optionLetter: "B", optionText: "Customers are shopping in a store.", isCorrect: true },
        { optionLetter: "C", optionText: "Customers are eating at a café.", isCorrect: false },
        { optionLetter: "D", optionText: "Customers are attending a meeting.", isCorrect: false }
      ]
    },
    {
      questionText: "Look at the picture and choose the statement that best describes what you see.",
      imageUrl: "https://images.unsplash.com/photo-1571624436279-b272adf20c0e?w=500",
      audioUrl: "/audio/part1/question10.mp3",
      options: [
        { optionLetter: "A", optionText: "A chef is serving food.", isCorrect: false },
        { optionLetter: "B", optionText: "A chef is preparing ingredients.", isCorrect: true },
        { optionLetter: "C", optionText: "A chef is cleaning dishes.", isCorrect: false },
        { optionLetter: "D", optionText: "A chef is taking orders.", isCorrect: false }
      ]
    }
  ];

  const part1 = await prisma.part.findUnique({ where: { partNumber: 1 } });
  for (const q of part1Questions) {
    await createQuestion(part1!.id, q, 'easy', 'single', 'This is a Part 1 photograph question. Listen carefully to the four statements and choose the one that best describes the picture.');
  }

  // Seed Part 2 - Question-Response
  console.log('🎧 Creating Part 2 questions (Question-Response)...');
  const part2Questions = [
    {
      questionText: "What time does the meeting start?",
      audioUrl: "/audio/part2/question1.mp3",
      options: [
        { optionLetter: "A", optionText: "It's in the conference room.", isCorrect: false },
        { optionLetter: "B", optionText: "At nine o'clock.", isCorrect: true },
        { optionLetter: "C", optionText: "About an hour.", isCorrect: false }
      ]
    },
    {
      questionText: "Who's responsible for the project?",
      audioUrl: "/audio/part2/question2.mp3",
      options: [
        { optionLetter: "A", optionText: "Sarah from marketing.", isCorrect: true },
        { optionLetter: "B", optionText: "It's due next week.", isCorrect: false },
        { optionLetter: "C", optionText: "Very important.", isCorrect: false }
      ]
    },
    {
      questionText: "Where did you put the reports?",
      audioUrl: "/audio/part2/question3.mp3",
      options: [
        { optionLetter: "A", optionText: "They're finished.", isCorrect: false },
        { optionLetter: "B", optionText: "On your desk.", isCorrect: true },
        { optionLetter: "C", optionText: "Yesterday morning.", isCorrect: false }
      ]
    },
    {
      questionText: "How often do you travel for work?",
      audioUrl: "/audio/part2/question4.mp3",
      options: [
        { optionLetter: "A", optionText: "About twice a month.", isCorrect: true },
        { optionLetter: "B", optionText: "To different cities.", isCorrect: false },
        { optionLetter: "C", optionText: "It's quite expensive.", isCorrect: false }
      ]
    },
    {
      questionText: "Why was the presentation postponed?",
      audioUrl: "/audio/part2/question5.mp3",
      options: [
        { optionLetter: "A", optionText: "It was very informative.", isCorrect: false },
        { optionLetter: "B", optionText: "The speaker got sick.", isCorrect: true },
        { optionLetter: "C", optionText: "Next Tuesday.", isCorrect: false }
      ]
    },
    {
      questionText: "Could you help me with this computer?",
      audioUrl: "/audio/part2/question6.mp3",
      options: [
        { optionLetter: "A", optionText: "It's very modern.", isCorrect: false },
        { optionLetter: "B", optionText: "Sure, what's wrong?", isCorrect: true },
        { optionLetter: "C", optionText: "In the IT department.", isCorrect: false }
      ]
    },
    {
      questionText: "When will the new office be ready?",
      audioUrl: "/audio/part2/question7.mp3",
      options: [
        { optionLetter: "A", optionText: "It's very spacious.", isCorrect: false },
        { optionLetter: "B", optionText: "By the end of the month.", isCorrect: true },
        { optionLetter: "C", optionText: "On the fifth floor.", isCorrect: false }
      ]
    },
    {
      questionText: "Have you seen my keys anywhere?",
      audioUrl: "/audio/part2/question8.mp3",
      options: [
        { optionLetter: "A", optionText: "They're silver.", isCorrect: false },
        { optionLetter: "B", optionText: "Check your coat pocket.", isCorrect: true },
        { optionLetter: "C", optionText: "I have three.", isCorrect: false }
      ]
    },
    {
      questionText: "Would you like some coffee?",
      audioUrl: "/audio/part2/question9.mp3",
      options: [
        { optionLetter: "A", optionText: "It's from Brazil.", isCorrect: false },
        { optionLetter: "B", optionText: "Yes, that would be nice.", isCorrect: true },
        { optionLetter: "C", optionText: "In the kitchen.", isCorrect: false }
      ]
    },
    {
      questionText: "How was your weekend?",
      audioUrl: "/audio/part2/question10.mp3",
      options: [
        { optionLetter: "A", optionText: "It was really relaxing.", isCorrect: true },
        { optionLetter: "B", optionText: "Next weekend is better.", isCorrect: false },
        { optionLetter: "C", optionText: "Two days long.", isCorrect: false }
      ]
    }
  ];

  const part2 = await prisma.part.findUnique({ where: { partNumber: 2 } });
  for (const q of part2Questions) {
    await createQuestion(part2!.id, q, 'medium', 'single', 'This is a Part 2 question-response item. Listen to the question and choose the best response.');
  }

  // Seed Part 5 - Incomplete Sentences (easier to implement)
  console.log('✏️ Creating Part 5 questions (Incomplete Sentences)...');
  const part5Questions = [
    {
      questionText: "The meeting _____ postponed until next week.",
      options: [
        { optionLetter: "A", optionText: "has been", isCorrect: true },
        { optionLetter: "B", optionText: "have been", isCorrect: false },
        { optionLetter: "C", optionText: "had been", isCorrect: false },
        { optionLetter: "D", optionText: "will been", isCorrect: false }
      ]
    },
    {
      questionText: "All employees must _____ their ID cards at all times.",
      options: [
        { optionLetter: "A", optionText: "wearing", isCorrect: false },
        { optionLetter: "B", optionText: "wear", isCorrect: true },
        { optionLetter: "C", optionText: "wore", isCorrect: false },
        { optionLetter: "D", optionText: "worn", isCorrect: false }
      ]
    },
    {
      questionText: "The project was completed _____ schedule.",
      options: [
        { optionLetter: "A", optionText: "on", isCorrect: true },
        { optionLetter: "B", optionText: "at", isCorrect: false },
        { optionLetter: "C", optionText: "in", isCorrect: false },
        { optionLetter: "D", optionText: "by", isCorrect: false }
      ]
    },
    {
      questionText: "We need to _____ our sales targets this quarter.",
      options: [
        { optionLetter: "A", optionText: "achieve", isCorrect: true },
        { optionLetter: "B", optionText: "achievement", isCorrect: false },
        { optionLetter: "C", optionText: "achieving", isCorrect: false },
        { optionLetter: "D", optionText: "achieved", isCorrect: false }
      ]
    },
    {
      questionText: "The new software will be _____ next month.",
      options: [
        { optionLetter: "A", optionText: "launch", isCorrect: false },
        { optionLetter: "B", optionText: "launched", isCorrect: true },
        { optionLetter: "C", optionText: "launching", isCorrect: false },
        { optionLetter: "D", optionText: "launches", isCorrect: false }
      ]
    },
    {
      questionText: "Please _____ your supervisor before leaving early.",
      options: [
        { optionLetter: "A", optionText: "inform", isCorrect: true },
        { optionLetter: "B", optionText: "information", isCorrect: false },
        { optionLetter: "C", optionText: "informing", isCorrect: false },
        { optionLetter: "D", optionText: "informed", isCorrect: false }
      ]
    },
    {
      questionText: "The conference room is _____ for the presentation.",
      options: [
        { optionLetter: "A", optionText: "prepare", isCorrect: false },
        { optionLetter: "B", optionText: "preparing", isCorrect: false },
        { optionLetter: "C", optionText: "prepared", isCorrect: true },
        { optionLetter: "D", optionText: "preparation", isCorrect: false }
      ]
    },
    {
      questionText: "Our company has _____ significantly this year.",
      options: [
        { optionLetter: "A", optionText: "grow", isCorrect: false },
        { optionLetter: "B", optionText: "growth", isCorrect: false },
        { optionLetter: "C", optionText: "growing", isCorrect: false },
        { optionLetter: "D", optionText: "grown", isCorrect: true }
      ]
    },
    {
      questionText: "The deadline has been _____ to Friday.",
      options: [
        { optionLetter: "A", optionText: "extend", isCorrect: false },
        { optionLetter: "B", optionText: "extended", isCorrect: true },
        { optionLetter: "C", optionText: "extending", isCorrect: false },
        { optionLetter: "D", optionText: "extension", isCorrect: false }
      ]
    },
    {
      questionText: "All applications must be _____ by 5 PM.",
      options: [
        { optionLetter: "A", optionText: "submit", isCorrect: false },
        { optionLetter: "B", optionText: "submitting", isCorrect: false },
        { optionLetter: "C", optionText: "submitted", isCorrect: true },
        { optionLetter: "D", optionText: "submission", isCorrect: false }
      ]
    }
  ];

  const part5 = await prisma.part.findUnique({ where: { partNumber: 5 } });
  for (const q of part5Questions) {
    await createQuestion(part5!.id, q, 'easy', 'single', 'Choose the word or phrase that best completes the sentence.');
  }

  // Create some sample questions for other parts (simplified)
  console.log('📚 Creating remaining parts with basic questions...');
  
  // Part 3, 4, 6, 7 - basic questions
  const basicQuestions = [
    { text: "What is the main purpose?", answer: "To inform customers" },
    { text: "When will this happen?", answer: "Next week" },
    { text: "Who is responsible?", answer: "The manager" },
    { text: "Where will it take place?", answer: "In the conference room" },
    { text: "Why was it changed?", answer: "Due to scheduling conflicts" },
    { text: "How will customers benefit?", answer: "Lower prices" },
    { text: "What should people do?", answer: "Contact customer service" },
    { text: "Which option is best?", answer: "Option A" },
    { text: "What is recommended?", answer: "Early registration" },
    { text: "What is the deadline?", answer: "End of month" }
  ];

  for (let partNum = 3; partNum <= 7; partNum++) {
    if (partNum === 5) continue; // Already done
    
    const part = await prisma.part.findUnique({ where: { partNumber: partNum } });
    
    for (let i = 0; i < 10; i++) {
      const questionData = {
        questionText: basicQuestions[i].text,
        audioUrl: partNum <= 4 ? `/audio/part${partNum}/question${i + 1}.mp3` : undefined,
        passageText: partNum >= 6 ? `This is a sample passage for Part ${partNum}, Question ${i + 1}. It contains information relevant to the question being asked.` : undefined,
        passageTitle: partNum >= 6 ? `Sample Document ${i + 1}` : undefined,
        options: [
          { optionLetter: "A", optionText: basicQuestions[i].answer, isCorrect: true },
          { optionLetter: "B", optionText: "Incorrect option B", isCorrect: false },
          { optionLetter: "C", optionText: "Incorrect option C", isCorrect: false },
          { optionLetter: "D", optionText: "Incorrect option D", isCorrect: false }
        ]
      };
      
      await createQuestion(
        part!.id, 
        questionData, 
        'medium', 
        partNum >= 6 ? 'passage' : 'single',
        `This is a Part ${partNum} question.`
      );
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
