'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardApplicationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/applications');
  }, [router]);

  return null;
}
