<?php
error_reporting(E_ERROR | E_PARSE);
require_once(dirname(__FILE__).'/bd/class.MySQL.php');
$oMySQL = new MySQL('dev_bambus','root','123456','localhost');

header("access-control-allow-origin: *");
set_time_limit(28800);
ini_set('display_errors', 0);
error_reporting(E_ALL);
if(isset($_GET['urlProjects'])){
	$url=$_GET['urlProjects'];
	$result=$oMySQL->Select('cache_portfolio', array('url'=>$url));
    if($result['data']){
    	echo $result['data'];
    }else{
		$curl_handle=curl_init();
		curl_setopt($curl_handle, CURLOPT_URL,$url);
		curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
		curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
		$response = curl_exec($curl_handle);
		$oMySQL->Insert(array('data'=> $response,'url'=>$url), 'cache_portfolio');
		echo $response;
    }
}else{
	echo 'error';
}
