<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Shopify\Clients\Rest;
use Shopify\Auth\Session as AuthSession;

class HomeController extends Controller
{
    public function products(Request $request)
    {

        /** @var AuthSession */
        $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

        // $client = new Rest($session->getShop(), $session->getAccessToken());
        // $result = $client->get('products/'.$request->id);

        // return response($result->getDecodedBody());

        // $swich = $request->notify;
        $shop = $session->getShop();

        // if ($swich == true) {
            $client = new Rest($session->getShop(), $session->getAccessToken());
            $result = $client->get('products');

            return response($result->getDecodedBody());
            // return response(['status' => 200, 'body' => $result->getDecodedBody(), 'massege' => 'success']);
        // } else {
        //     return response(['status' => 201, 'body' => '', 'massege' => 'somthing wants worng.']);
        // }
    }
}
