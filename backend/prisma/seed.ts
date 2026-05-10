import { PrismaClient, Category } from '@prisma/client';
import { slugify } from '../src/utils/slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a developer user
  const devUser = await prisma.user.upsert({
    where: { walletAddress: 'Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz' },
    update: {},
    create: {
      walletAddress: 'Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz',
      role: 'DEVELOPER',
      displayName: 'AgentStudio',
      bio: 'We build the best AI agents on Solana.'
    }
  });

  console.log(`Created developer user: ${devUser.displayName}`);

  // Demo agents
  const agents = [
    {
      name: 'AI Image Generator Pro',
      shortDesc: 'Generate stunning images with GPT-4 Vision and Stable Diffusion.',
      description: 'The ultimate AI image generator for creative professionals. Simply enter a prompt and receive high-quality images in seconds. Full API access included.',
      category: Category.IMAGE,
      priceSOL: 0.5,
      agentUrl: 'https://example-agent.com/image-gen',
      demoUrl: 'https://example-agent.com/demo/image-gen',
      imageUrl: 'https://images.unsplash.com/photo-1682687981974-c5ef2111640c?q=80&w=800',
      tags: ['image', 'art', 'creative']
    },
    {
      name: 'Slide Deck Builder AI',
      shortDesc: 'Instantly create beautiful presentation slides from text.',
      description: 'Stop wasting time on PowerPoint. Paste your text or outline, and this agent will generate a beautifully designed slide deck ready for download.',
      category: Category.PRODUCTIVITY,
      priceSOL: 0.3,
      agentUrl: 'https://example-agent.com/slides',
      demoUrl: 'https://example-agent.com/demo/slides',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
      tags: ['slides', 'productivity', 'business']
    },
    {
      name: 'Code Review Assistant',
      shortDesc: 'Automated PR reviews and security checks.',
      description: 'Connect your GitHub repo and get instant code reviews. This agent finds bugs, suggests performance improvements, and checks for security vulnerabilities.',
      category: Category.CODE,
      priceSOL: 0.2,
      agentUrl: 'https://example-agent.com/code-review',
      demoUrl: 'https://example-agent.com/demo/code-review',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
      tags: ['coding', 'github', 'security']
    },
    {
      name: 'Voice Clone Studio',
      shortDesc: 'Clone voices and generate realistic text-to-speech audio.',
      description: 'Upload a 30-second audio clip to clone any voice. Then use the API to generate high-fidelity text-to-speech in multiple languages.',
      category: Category.VOICE,
      priceSOL: 1.0,
      agentUrl: 'https://example-agent.com/voice-clone',
      demoUrl: null, // No demo for this one
      imageUrl: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=800',
      tags: ['voice', 'tts', 'audio']
    },
    {
      name: 'Data Insights Bot',
      shortDesc: 'Chat with your CSV/Excel files to extract insights.',
      description: 'Upload any spreadsheet and ask questions in plain English. Get charts, summaries, and deep insights instantly without knowing SQL.',
      category: Category.DATA,
      priceSOL: 0.4,
      agentUrl: 'https://example-agent.com/data-bot',
      demoUrl: 'https://example-agent.com/demo/data-bot',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
      tags: ['data', 'analytics', 'csv']
    }
  ];

  for (const agent of agents) {
    const slug = slugify(agent.name);
    
    await prisma.agent.upsert({
      where: { slug },
      update: {},
      create: {
        ...agent,
        slug,
        developerId: devUser.id,
        isApproved: true,
        isActive: true
      }
    });
    
    console.log(`Created agent: ${agent.name}`);
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
