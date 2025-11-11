import { NextResponse } from "next/server";

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  publishedDate?: string;
  description?: string;
  categories?: string[];
  rating?: number;
  pageCount?: number;
  isbn?: string;
  publisher?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "20";

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Search query is required",
        results: [],
      });
    }

    // Llamada a Google Books API
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=${limit}&printType=books&langRestrict=en`,
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search books from Google Books API");
    }

    const data = await response.json();
    const results: SearchResult[] =
      data.items?.map((item: any) => {
        // Obtener imagen de mayor calidad
        let coverImage = item.volumeInfo.imageLinks?.thumbnail;
        if (coverImage) {
          coverImage = coverImage.replace("http://", "https://");
          coverImage = coverImage.replace("&zoom=1", "&zoom=2");
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
          pageCount: item.volumeInfo.pageCount,
          isbn:
            item.volumeInfo.industryIdentifiers?.[0]?.identifier ||
            item.volumeInfo.industryIdentifiers?.[1]?.identifier,
          publisher: item.volumeInfo.publisher,
        };
      }) || [];

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      query,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search books",
        results: [],
      },
      { status: 500 }
    );
  }
}

