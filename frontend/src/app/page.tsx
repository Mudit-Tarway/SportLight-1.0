import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the login page as the default entry point.
  redirect('/login');
}
