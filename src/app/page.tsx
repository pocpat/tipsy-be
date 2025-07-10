
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  // We still check for the user ID to provide a useful debug status.
  const { userId } =  await auth();

  return (
    <main style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <h1>Tipsy Backend API</h1>
        <p>Status: ✅ Online</p>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <h2>Purpose</h2>
        <p>
          This is the backend server for the Tipsy Nail Art mobile app.
          It provides API endpoints under the <code>/api</code> route.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Authentication Status</h2>
        {userId ? (
          <p style={{ color: 'green' }}>
            ✅ A user is currently signed in. (UserID: {userId})
          </p>
        ) : (
          <p style={{ color: 'orange' }}>
            ℹ️ No user is currently signed in. API routes are protected.
          </p>
        )}
      </section>
    </main>
  );
}