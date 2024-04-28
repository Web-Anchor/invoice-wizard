import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db/index';
import { stripeKeys } from '@db/schema/stripeKeys';
import { eq } from 'drizzle-orm';
import { users } from '@db/schema/users';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(request: NextRequest) {
  auth().protect();

  try {
    // --------------------------------------------------------------------------------
    // 📌  User auth
    // --------------------------------------------------------------------------------
    const { userId } = auth();

    // --------------------------------------------------------------------------------
    // 📌  Validate & validate sub type
    // --------------------------------------------------------------------------------
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId!));
    console.log('👤 User ', userId, dbUser);
    // TODO restrict access if no sub expires | Use own Stripe API key

    // --------------------------------------------------------------------------------
    // 📌  Get Account API keys
    // --------------------------------------------------------------------------------
    const keys = await db
      .select()
      .from(stripeKeys)
      .where(eq(stripeKeys.userId, dbUser[0].id.toString()));
    console.log('🔑 keys', keys);

    // --------------------------------------------------------------------------------
    // 📌  Get User Customer
    // --------------------------------------------------------------------------------
    const apiKey = keys?.[0]?.restrictedAPIKey;
    const stripe = require('stripe')(apiKey);

    // customers
    const customers = await stripe.customers.list({
      limit: 2,
    });

    // const { email, next_page } = await request.json();
    // get customer information
    // const customer = await stripe.customers.search({
    //   query: `email~"${email}"`,
    // });
    // const customerId = customer.data[0].id;
    // const charges = await stripe.charges.search({
    //   limit: 2,
    //   page: next_page === null ? undefined : next_page,
    //   query: `customer:"${customerId}"`,
    // });
    // find charges by customer email
    // const charges = await stripe.charges.list({ customer: 'cus_KfMq1e3J3Q3HbD' });

    // const { data } = await axios.get(
    //   `${APP_URL}/api/v1/stripe/keys?account=${account}&keyId=${keyId}`
    // );
    // console.log('🔑 keys', data);

    return NextResponse.json({ customers });
  } catch (error: any) {
    console.error('🔑 error', error);
    return NextResponse.json({ error: error?.message });
  }
}
