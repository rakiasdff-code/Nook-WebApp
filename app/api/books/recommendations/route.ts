import { NextResponse } from "next/server";

export interface BookRecommendation {
  id: string;
  title: string;
  authors: string[];
  coverImage?: string;
  description?: string;
  categories?: string[];
  rating?: number;
  matchReason: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genres = searchParams.get("genres") || "fantasy,fiction";
    const limit = searchParams.get("limit") || "8";

    // TODO: En el futuro, esto consultará las lecturas del usuario desde Firebase
    // Por ahora, usamos los géneros proporcionados para hacer recomendaciones

    const genreList = genres.split(",");
    const allRecommendations: BookRecommendation[] = [];

    // Obtener recomendaciones para cada género
    for (const genre of genreList.slice(0, 2)) {
      // Limitar a 2 géneros por performance
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${genre.trim()}&orderBy=relevance&maxResults=4&printType=books&langRestrict=en`,
        {
          next: { revalidate: 7200 }, // Cache por 2 horas
        }
      );

      if (response.ok) {
        const data = await response.json();
        const books = data.items?.map((item: any) => {
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
            description: item.volumeInfo.description,
            categories: item.volumeInfo.categories,
            rating: item.volumeInfo.averageRating,
            matchReason: `Based on your interest in ${genre}`,
          };
        }) || [];

        allRecommendations.push(...books);
      }
    }

    // Limitar al número solicitado
    const recommendations = allRecommendations.slice(0, parseInt(limit));

    return NextResponse.json({
      success: true,
      recommendations,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error fetching book recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recommendations",
        recommendations: [],
      },
      { status: 500 }
    );
  }
}

