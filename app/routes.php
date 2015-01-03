<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', array('uses' => 'HomeController@showHome', 'as' => 'home'));
// Game
Route::controller('game','GameController');
// User
Route::get('user/show/{username}', array('uses' => 'UsersController@show', 'as' => 'user.show'));


// Only Guests
Route::group(array('before' => 'guest'), function () {
    // User
    Route::get('user/create', array('uses' => 'UsersController@create', 'as' => 'user.create'));
    Route::post('user/store', array('uses' => 'UsersController@store', 'as' => 'user.store'));
    // Auth
    Route::get('login', array('uses' => 'AuthController@getLogin'));
    Route::post('/', array('uses' => 'AuthController@postLogin', 'as'=>'login'));
    // Pass Reminder
    Route::controller('password', 'RemindersController');
});

// Only Users
Route::group(array('before' => 'auth'), function () {
    // Player
    Route::controller('player', 'PlayersController');
    // Auth
    Route::get('logout', array('uses' => 'AuthController@getLogout', 'as' => 'logout'));
    Route::put('user/update', array('uses' => 'UsersController@update', 'as' => 'user.update'));
});

// Not Finished Yet
Route::group(array('before' => 'not.finished'), function () {
    Route::resource('tournament','TournamentController');
    Route::resource('replay','ReplayController');
    Route::resource('calendar','CalendarController');
    Route::resource('ranking','RankingController');
    Route::get('user/edit', array('uses' => 'UsersController@edit', 'as' => 'user.edit'));

    Route::delete('user/delete', array('uses' => 'UsersController@delete', 'as' => 'user.delete'));

});
