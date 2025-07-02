import { useEffect, useState } from 'react';
import { auth } from '@/firebase/client';
import { User, onAuthStateChanged } from 'firebase/auth';

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return { user, loading };
}