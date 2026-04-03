import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { scrapeMunicode } from './sources/municode.js';
import { scrapeSocrata } from './sources/socrata.js';
import { scrapeCityPortals } from './sources/city-portals.js';
import { db } from './shared/db.js';
import { scraperJobs } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

export const scraperQueue = new Queue('scraper', { connection });

const worker = new Worker('scraper', async (job) => {
  const { jobId, source, jurisdictionId } = job.data;
  console.log(`Processing job ${jobId} | source: ${source} | jurisdiction: ${jurisdictionId}`);
  await db.update(scraperJobs).set({ status: 'running', startedAt: new Date() }).where(eq(scraperJobs.id, jobId));
  try {
    let result;
    if (source === 'all') {
      const [m, s, c] = await Promise.allSettled([scrapeMunicode(jurisdictionId), scrapeSocrata(jurisdictionId), scrapeCityPortals(jurisdictionId)]);
      result = { municode: m.status === 'fulfilled' ? m.value : { error: m.reason?.message }, socrata: s.status === 'fulfilled' ? s.value : { error: s.reason?.message }, cityPortals: c.status === 'fulfilled' ? c.value : { error: c.reason?.message } };
    } else if (source === 'municode') { result = await scrapeMunicode(jurisdictionId);
    } else if (source === 'socrata') { result = await scrapeSocrata(jurisdictionId);
    } else if (source === 'city-portals') { result = await scrapeCityPortals(jurisdictionId);
    } else { throw new Error('Unknown source: ' + source); }
    await db.update(scraperJobs).set({ status: 'completed', completedAt: new Date(), result }).where(eq(scraperJobs.id, jobId));
    return result;
  } catch (error) {
    await db.update(scraperJobs).set({ status: 'failed', completedAt: new Date(), error: error.message }).where(eq(scraperJobs.id, jobId));
    throw error;
  }
}, { connection, concurrency: 2 });

worker.on('completed', (job) => console.log('Job done:', job.id));
worker.on('failed', (job, err) => console.error('Job failed:', job?.id, err.message));
console.log('Permit Pilot scraper worker started');
