# 📚 Reading Status Integration Guide

## Overview
El banner de "Currently Reading" y "Want to Read" ahora es completamente dinámico y muestra diferentes estados según los datos del usuario.

## ✨ Estados implementados

### Currently Reading
- **Con libro**: Muestra título, autor y barra de progreso (%)
- **Sin libro**: Muestra "What are you reading?" con CTA "Add current book"

### Want to Read
- **Con libros**: Muestra lista de autores (max 3) + contador
- **Sin libros**: Muestra "What do you want to read?" con CTA "Add to list"

## 🧪 Probar estados

En `/app/(main)/home/page.tsx`, líneas 52-71:

```typescript
// Estado CON datos (actual):
const [currentlyReading] = useState<ReadingBook | undefined>({
  id: "1",
  title: "The Heir of Fire",
  author: "Sarah J. Maas",
  progress: 47,
});

// Estado VACÍO (para probar):
const [currentlyReading] = useState<ReadingBook | undefined>(undefined);
```

## 🔥 Integración con Firebase

### 1. Estructura de datos en Firestore

```
users/{userId}/
  └── reading/
      ├── current: {
      │   bookId: string
      │   title: string
      │   author: string
      │   coverUrl?: string
      │   progress: number (0-100)
      │   startedAt: timestamp
      │   updatedAt: timestamp
      │ }
      └── wantToRead: [
          {
            bookId: string
            title: string
            author: string
            addedAt: timestamp
          }
        ]
```

### 2. Hook personalizado (crear)

```typescript
// lib/hooks/useReadingStatus.ts
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useReadingStatus(userId: string | undefined) {
  const [currentlyReading, setCurrentlyReading] = useState<ReadingBook | undefined>();
  const [wantToRead, setWantToRead] = useState<ReadingBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const readingRef = doc(db, "users", userId, "reading", "status");
    const unsubscribe = onSnapshot(readingRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCurrentlyReading(data.current);
        setWantToRead(data.wantToRead || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { currentlyReading, wantToRead, loading };
}
```

### 3. Actualizar HomePage

```typescript
// En HomePage
import { useReadingStatus } from "@/lib/hooks/useReadingStatus";

export default function HomePage() {
  const { user } = useAuth();
  const { currentlyReading, wantToRead, loading } = useReadingStatus(user?.uid);

  // ... resto del código
}
```

### 4. Funciones para actualizar datos

```typescript
// lib/reading.ts
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export async function setCurrentBook(
  userId: string,
  book: ReadingBook
) {
  const readingRef = doc(db, "users", userId, "reading", "status");
  await setDoc(readingRef, {
    current: {
      ...book,
      startedAt: new Date(),
      updatedAt: new Date(),
    }
  }, { merge: true });
}

export async function updateProgress(
  userId: string,
  progress: number
) {
  const readingRef = doc(db, "users", userId, "reading", "status");
  await updateDoc(readingRef, {
    "current.progress": progress,
    "current.updatedAt": new Date(),
  });
}

export async function addToWantToRead(
  userId: string,
  book: ReadingBook
) {
  const readingRef = doc(db, "users", userId, "reading", "status");
  await updateDoc(readingRef, {
    wantToRead: arrayUnion({
      ...book,
      addedAt: new Date(),
    })
  });
}
```

## 🎨 Personalización

### Cambiar textos
En `/components/ReadingStatusBanner.tsx`:
- Línea 64: Texto "What are you reading?"
- Línea 65: Texto "What do you want to read?"
- Línea 74: CTA "Add current book"
- Línea 74: CTA "Add to list"

### Ajustar estilos
Clases principales:
- `.font-serif` - Títulos
- `.text-nook-green-light` - Color principal
- `.bg-nook-green-light` - Color de botones y barra de progreso

## 📊 Analytics (Opcional)

Puedes trackear cuando el usuario:
- Añade un libro actual
- Actualiza el progreso
- Añade a want-to-read

```typescript
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";

logEvent(analytics, "book_started", {
  book_title: book.title,
  book_author: book.author
});
```

## 🚀 Deploy

1. Crear la colección `reading` en Firestore
2. Actualizar las rules de seguridad:

```
match /users/{userId}/reading/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

3. Deploy como siempre

## 📝 TODO

- [ ] Implementar hook useReadingStatus
- [ ] Crear funciones en lib/reading.ts
- [ ] Actualizar Firestore rules
- [ ] Conectar botones CTA con modals para añadir libros
- [ ] Implementar búsqueda de libros en bookshelf
- [ ] Añadir animaciones a la barra de progreso

