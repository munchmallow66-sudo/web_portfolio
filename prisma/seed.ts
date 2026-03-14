import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Start seeding...')

    // 1. Upsert Admin User
    const adminEmail = 'admin@example.com'
    const adminPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            role: 'ADMIN',
        },
    })
    console.log(`Upserted admin user: ${admin.email}`)

    // 2. Upsert Sample Project
    const sampleProjectSlug = 'sample-portfolio-project'

    const project = await prisma.project.upsert({
        where: { slug: sampleProjectSlug },
        update: {},
        create: {
            title: 'Sample Portfolio Project',
            slug: sampleProjectSlug,
            shortDescription: 'This is a sample project for the portfolio.',
            fullDescription: 'This is a more detailed description of the sample project. It showcases the capabilities of the portfolio system.',
            techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Tailwind CSS'],
            tags: ['Web Development', 'Full-Stack'],
            githubUrl: 'https://github.com/example/repo',
            liveUrl: 'https://example.com',
            featured: true,
            images: {
                create: [
                    { url: 'https://placehold.co/600x400/png' }
                ]
            },
            analytics: {
                create: {
                    views: 100
                }
            }
        },
    })
    console.log(`Upserted sample project: ${project.title}`)

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
