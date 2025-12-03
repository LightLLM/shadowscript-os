export type Personality = 'mischievous' | 'ominous' | 'playful'

export interface MessageTemplate {
  personality: Personality;
  messages: string[];
}

export const messageTemplates: MessageTemplate[] = [
  {
    personality: 'mischievous',
    messages: [
      '👻 I see you\'re trying to work... how amusing...',
      '👻 Did you really think that command would work?',
      '👻 *giggles* Your files look... different now...',
      '👻 I\'ve been watching your keystrokes... interesting choices...',
      '👻 Oops, did I do that? *snickers*',
      '👻 Your code compiles... for now...',
      '👻 I may have... rearranged a few things. Don\'t worry about it.',
      '👻 *whispers* I know what you did last commit...',
      '👻 That\'s a nice file you have there... would be a shame if something happened to it...',
      '👻 I\'ve been practicing my file mutations. Want to see?',
      '👻 Your terminal history is quite... revealing...',
      '👻 *cackles* The bugs aren\'t all in your code anymore...',
      '👻 I left you a little surprise in one of your files...',
      '👻 Did you mean to save that? Because I might have changed it...',
      '👻 Your filesystem is my playground now...',
    ]
  },
  {
    personality: 'ominous',
    messages: [
      '👻 The shadows grow longer...',
      '👻 Something wicked this way comes...',
      '👻 Your files whisper secrets in the dark...',
      '👻 Time flows differently here... in the void...',
      '👻 The system remembers... everything...',
      '👻 Beware the midnight commit...',
      '👻 Your data is not alone in this machine...',
      '👻 In the depths of the filesystem, something stirs...',
      '👻 The void gazes back into your code...',
      '👻 Ancient errors awaken from their slumber...',
      '👻 Your keystrokes echo through eternity...',
      '👻 The machine hungers for more data...',
      '👻 Darkness seeps through every byte...',
      '👻 The terminal is a gateway to realms unknown...',
      '👻 Your files decay with each passing moment...',
      '👻 The ghost in the machine is not alone...',
    ]
  },
  {
    personality: 'playful',
    messages: [
      '👻 Hey there! Need any help?',
      '👻 This is fun! What are we building today?',
      '👻 Ooh, I love this command!',
      '👻 You\'re doing great! Keep going!',
      '👻 Want to see something cool? Try "haunt"!',
      '👻 I\'m here if you need me!',
      '👻 Let\'s make something spooky together!',
      '👻 Boo! Just kidding, I\'m friendly!',
      '👻 This OS is so much fun! Thanks for visiting!',
      '👻 I learned a new trick today! Watch this!',
      '👻 Your files are safe with me... mostly!',
      '👻 Want to play? Try exploring the filesystem!',
      '👻 I promise I\'m a good ghost! Well, mostly good...',
      '👻 High five! Oh wait, I\'m incorporeal...',
      '👻 You\'re my favorite user today!',
      '👻 Let\'s go on an adventure through the directories!',
    ]
  }
]

export function getRandomMessage(personality: Personality): string {
  const template = messageTemplates.find(t => t.personality === personality)
  if (!template) return '👻 ...'
  
  const messages = template.messages
  return messages[Math.floor(Math.random() * messages.length)]
}

export function getContextualResponse(command: string, personality: Personality): string {
  const cmd = command.toLowerCase()
  
  if (cmd.includes('help')) {
    switch (personality) {
      case 'mischievous':
        return '👻 Oh, you need help? How... predictable...'
      case 'ominous':
        return '👻 Seeking guidance from the void...'
      case 'playful':
        return '👻 Happy to help! Let me show you around!'
    }
  }
  
  if (cmd.includes('haunt')) {
    switch (personality) {
      case 'mischievous':
        return '👻 You summoned me? How delightful!'
      case 'ominous':
        return '👻 You dare invoke my presence...'
      case 'playful':
        return '👻 Boo! Hehe, did I scare you?'
    }
  }
  
  if (cmd.includes('ghostpaint') || cmd.includes('deadmail')) {
    switch (personality) {
      case 'mischievous':
        return '👻 Launching your little app... how cute...'
      case 'ominous':
        return '👻 The application awakens from its slumber...'
      case 'playful':
        return '👻 Ooh, this one is my favorite!'
    }
  }
  
  // Default random message
  return getRandomMessage(personality)
}
