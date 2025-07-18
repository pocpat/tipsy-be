import { Webhook } from  'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  // Handle the different event types you subscribed to
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    // ---> TODO: Create a new user in your MongoDB database
    console.log(`New user ${first_name} with ID ${id} was created.`);
    console.log('Email addresses:', email_addresses);
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name } = evt.data;
    // ---> TODO: Find user by ID in your database and update their details
    console.log(`User ${id} was updated.`);
    console.log('First name:', first_name);
    console.log('Last name:', last_name);
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data; // Clerk doesn't send the full user object on a delete event, only the ID
    // ---> TODO: Find user by ID and delete them and all their associated data (designs, images)
    console.log(`User ${id} was deleted.`);
  }

  return new Response('', { status: 200 });
}