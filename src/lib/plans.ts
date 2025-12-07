import { PLAN } from "@/constants";

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    clientLimit: 50, // 50 clients max
    price: 0,
    smsHandling: "own", // User provides own Twilio (they pay per SMS)
  },
  starter: {
    id: "starter",
    name: "Starter",
    clientLimit: 100,
    price: 5, // €5/month
    smsHandling: "managed", // We handle SMS (includes SMS costs + our commission)
  },
  pro: {
    id: "pro",
    name: "Pro",
    clientLimit: null, // Unlimited
    price: 15, // €15/month
    smsHandling: "managed", // We handle SMS (includes SMS costs + our commission)
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanLimit(plan: string): number | null {
  if (plan === PLAN.FREE) return PLANS.free.clientLimit;
  if (plan === PLAN.STARTER) return PLANS.starter.clientLimit;
  if (plan === PLAN.PRO) return PLANS.pro.clientLimit;
  return PLANS.free.clientLimit; // Default to free
}

export function canAddClient(currentCount: number, plan: string): boolean {
  const limit = getPlanLimit(plan);
  if (limit === null) return true; // Unlimited
  return currentCount < limit;
}

export function usesManagedSMS(plan: string): boolean {
  return plan === PLAN.STARTER || plan === PLAN.PRO;
}
