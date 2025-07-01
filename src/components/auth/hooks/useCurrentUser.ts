import { useEffect, useState } from 'react';
import { auth } from '@/app/api/firebase/config';
import { User, onAuthStateChanged } from 'firebase/auth';

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);
    return user;
}