<?php

class UsersController extends BaseController
{
    /**
     * User Repository
     *
     * @var user
     */
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function game()
    {
        return View::make('game.index');
    }
    public function showLogin()
    {
        return View::make('users.login');
    }

    public function handleLogin()
    {
        $input = Input::only(['username', 'password']);
        $validator = Validator::make($input, User::$login_rules);

        if($validator->fails()) {
            return $this->showLogin()->withErrors($validator)->withInput(Input::except('password'));
        }

        if(Auth::attempt(['username' => $input['username'], 'password' => $input['password']])) {
            return Redirect::route('home');
        } elseif(Auth::attempt(['email' => $input['username'], 'password' => $input['password']])) {
            return Redirect::route('home');
        }

        return $this->showLogin()->withInput(Input::except('password'))->withErrors('Wrong Username/Email and Password combination.');
    }

    public function profile()
    {
        return View::make('users.show');
    }

    public function logout()
    {
        if(Auth::check()){
            Auth::logout();
        }
        return Redirect::route('home');
    }

    /**
	 * Show the form for creating a new resource.
	 * GET /users/create
	 *
	 * @return Response
	 */
    public function create()
    {
        return View::make('users.create');
    }

    /**
	 * Store a newly created resource in storage.
	 * POST /users
	 *
	 * @return Response
	 */
    public function store()
    {
        $data = Input::all();
        $validator = Validator::make($data, User::$create_rules);
        if($validator->fails()) {
            return Redirect::route('user.create')->withErrors($validator)->withInput();
        }

        $validator = Validator::make($data, Person::$rules);
        if ($validator->fails()) {
            return Redirect::route('user.create')->withErrors($validator)->withInput();
        }

        try{
            $data['password'] = Hash::make($data['password']);
            $this->user = $this->user->create($data);
            if(! $this->user){
                throw new Exception();
            }
        }catch(Exception $e){
            return Redirect::route('user.create')->withErrors("Error Processing Request. Please try again.")->withInput();
        }

        try{
            $data['birth_date'] = date('d/m/y', strtotime($data['birth_date']));
            Debugbar::info($this->user);
            $data['user_id'] = $this->user->id;
            $this->user->person()->create($data);
            if(! $this->user->person()){
                throw new Exception();
            }
        }catch(Exception $e){
            $this->user->delete();
            return Redirect::route('user.create')->withErrors("Error Processing Request. Please try again.")->withInput();
        }

        Auth::login($this->user);
        return Redirect::route('home');

    }

    /**
	 * Display the specified resource.
	 * GET /users/
	 *
	 * @return Response
	 */
    public function show()
    {
        return View::make('users.show');
    }

    /**
	 * Show the form for editing the specified resource.
	 * GET /users/edit
	 *
	 * @return Response
	 */
    public function edit()
    {
        //
    }

    /**
	 * Update the specified resource in storage.
	 * PUT /users/
	 * @return Response
	 */
    public function update()
    {
        //
    }

    /**
	 * Remove the specified resource from storage.
	 * DELETE /users/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
    public function destroy($id)
    {
        //
    }

}
