import { NextResponse } from "next/server";

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    infoLink?: string;
  };
}

export interface BookRelease {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  rating?: number;
  link?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre") || "fiction";
    const limit = searchParams.get("limit") || "12";

    // Llamada a Google Books API
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=newest&maxResults=${limit}&printType=books&langRestrict=en`,
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books from Google Books API");
    }

    const data = await response.json();
    const books: BookRelease[] = data.items?.map((item: GoogleBooksVolume) => {
      // Obtener imagen de mayor calidad
      let coverImage = item.volumeInfo.imageLinks?.thumbnail;
      if (coverImage) {
        // Reemplazar http por https y aumentar zoom
        coverImage = coverImage.replace("http://", "https://");
        // Cambiar zoom=1 a zoom=2 para mejor calidad
        coverImage = coverImage.replace("&zoom=1", "&zoom=2");
        // Si no tiene zoom, añadirlo
        if (!coverImage.includes("zoom=")) {
          coverImage += "&zoom=2";
        }
      }

      return {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["Unknown Author"],
        coverImage,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        categories: item.volumeInfo.categories,
        rating: item.volumeInfo.averageRating,
        link: item.volumeInfo.infoLink,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      books,
      total: books.length,
    });
  } catch (error) {
    console.error("Error fetching new book releases:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch new book releases",
        books: [],
      },
      { status: 500 }
    );
  }
}

