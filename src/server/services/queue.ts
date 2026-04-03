import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

export const analysisQueue = new Queue('analysis', { connection });
export const pdfQueue = new Queue('pdf', { connection });
export const scraperQueue = new Queue('scraper', { connection });

// Add job helpers
export async function addAnalysisJob(data: any) {
  return analysisQueue.add('analyze', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
}

export async function addPdfJob(data: any) {
  return pdfQueue.add('generate', data, {
    attempts: 3,
  });
}

export async function addScraperJob(data: any) {
  return scraperQueue.add('scrape', data, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
  });
}

// Worker for analysis jobs (if running separate worker process)
export function startAnalysisWorker(handler: (job: Job) => Promise<any>) {
  const worker = new Worker('analysis', async (job: Job) => {
    return handler(job);
  }, { connection });
  return worker;
}
