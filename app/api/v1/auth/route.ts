import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db/index';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { handleIsRedirect } from '@helpers/index';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  try {
    auth().protect();

    const { searchParams } = new URL(request.url);
    const redirect = searchParams.get('redirect');

    const { userId } = auth();
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId!));
    console.log('👤 User record: ', dbUser);

    if (!dbUser?.length) {
      console.log(
        'No user record found. Creating record in database',
        redirect
      );

      return new Response(null, {
        status: 302,
        // post data to create user
        headers: {
          Location: APP_URL + `/api/v1/create-user` + `?redirect=${redirect}`,
        },
      });
    }

    console.log('👤 User record found');
    return new Response(null, {
      status: 302,
      headers: {
        Location: APP_URL + decodeURIComponent(redirect ?? '') ?? '/dashboard',
      },
    });
  } catch (error: any) {
    console.error(error);

    return new Response(null, {
      status: 302,
      headers: {
        Location: APP_URL + '/sign-in',
      },
    });
  }
}
