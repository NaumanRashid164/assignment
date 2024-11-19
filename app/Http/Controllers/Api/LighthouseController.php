<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LighthouseController extends Controller
{
    public function analyze(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|url',
            'platform' => 'required|in:Mobile,Desktop',
        ]);

        $strategy = strtolower($validated['platform']);
        $url = $validated['url'];
        $response = Http::get("https://www.googleapis.com/pagespeedonline/v5/runPagespeed", [
            'url' => $url,
            'strategy' => $strategy,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch performance data'], 500);
        }

        $performanceScore = $response->json('lighthouseResult.categories.performance.score');

        return response()->json(['performance_score' => floatval($performanceScore) * 100 . " %"]);
    }
}
