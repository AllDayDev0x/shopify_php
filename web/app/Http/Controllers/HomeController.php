<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Shopify\Clients\Rest;
use Shopify\Auth\Session as AuthSession;
use \Exception;

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

    public function updateProduct(Request $request){
        $data = $request->input('body');
        $product_id = $data['productId'];
        $productName = $data['productName'];
        $productDesc = $data['productDesc'];
        try{
            $session = $request->get('shopifySession');
            $shop = $session->getShop();

        $updatedProductData = [
            'product' => [
                'id' => $product_id,
                'title' => $productName,
                'body_html' => $productDesc
                // Add other properties as needed
            ]
        ];

            $client = new Rest($session->getShop(), $session->getAccessToken());
            $result = $client->put("products/$product_id", $updatedProductData);
            return response(['status' => 200, 'body' =>$result->getDecodedBody(), 'massege' => 'success']);
        }
        catch (Exception $e) {
            // Handle any errors that occur during the API request
            return response(['status' => 500, 'message' => $e->getMessage()]);
        }

    }

    public function deleteProduct(Request $request){
        $data = $request->input('body');
        $product_id = $data['productId'];
        try{
            $session = $request->get('shopifySession');
            $shop = $session->getShop();

            $client = new Rest($session->getShop(), $session->getAccessToken());
            $result = $client->delete("products/$product_id");
            return response(['status' => 200, 'massege' => 'success']);
        }
        catch (Exception $e) {
            // Handle any errors that occur during the API request
            return response(['status' => 500, 'message' => $e->getMessage()]);
        }
    }
}