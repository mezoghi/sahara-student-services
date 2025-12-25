'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardDocumentsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Documents are currently managed per-application.
    // Redirect to applications list as the entry point.
    router.replace('/applications');
  }, [router]);

  return null;
}
