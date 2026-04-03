import { Queue, Worker, QueueScheduler } from 'bullmq';
import Ioredis from 'ioredis';
import { scrapeMunicode } from './sources/municode.js';
import { scrapeSocrata } from './sources/socrata.js';
import { scrapeCityPortals } from './sources/city-portals.js';
import { db } from './shared/db.js';
import { scraperJobs } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const connection = new Ioredis({ host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 });

// Define queue
const scraperQueue = new Queue('scraper', { connection });
new QueueScheduler('scraper', { connection });

// Add job processor
const worker = new Worker('scraper', async job => {
  const { jobId, source, jurisdictionId } = job.data;
  
  // Update job status to running
  await db.update(scraperJobs).set({ status: 'running', startedAt: new Date() }).where(eq(scraperJobs.id, jobId));
  
  try {
    let result;
    if (source === 'all') {
      // Run all sources for the jurisdiction
      const municode = await scrapeMunicode(jurisdictionId);
      const socrata = await scrapeSocrata(jurisdictionId);
      const cityPortals = await scrapeCityPortals(jurisdictionId);
      result = { municode, socrata, cityPortals };
    } else if (source === 'municode') {
      result = await scrapeMunicode(jurisdictionId);
    } else if (source === 'socrata') {
      result = await scrapeSocrata(jurisdictionId);
    } else if (source === 'city-portals') {
      result = await scrapeCityPortals(jurisdictionId);
    } else {
      throw new Error(`Unknown source: ${source}`);
    }
    
    // Mark job completed
    await db.update(scraperJobs).set({ status: 'completed', completedAt: new Date(), result }).where(eq(scraperJobs.id, jobId));
  } catch (error) {
    // Mark job failed
    await db.update(scraperJobs).set({ status: 'failed', completedAt: new Date(), error: error.message }).where(eq(scraperJobs.id, jobId));
  }
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));

// Export queue for adding jobs
export { scraperQueue };

// If run directly, start worker
if (require.main === module) {
  console.log('Scraper worker started');
}
