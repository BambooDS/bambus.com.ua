<?php
require_once(dirname(__FILE__).'/bd/class.MySQL.php');
$oMySQL = new MySQL('dev_bambus','root','123456');
$result=$oMySQL->Delete('cache_portfolio');
if($result){
	echo 'Your cache is cleared successfully';
}else{
	echo 'Erorr';
};