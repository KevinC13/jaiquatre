<?php 
echo 'ok';
$file = 'site.xml';
switch ($_GET['action']) {
	case 'read':
		$xml = simplexml_load_file($file);
    	print_r(json_encode($xml));
		break;
	case 'write':
		$xml = simplexml_load_file($file);
		foreach ($xml as $key => $value) {
			if($_GET['point'] > $value->point){
				echo "Gros Scrore";
				$gamer = $xml->gamer;
				$gamer = $gamer->addChild('gamer');
				$gamer->addChild('user', 'test');
				$gamer->addChild('point', '1000');
				$xml->asXML($file);
				echo "done";
				exit();
			}
		}
		echo 'write';
		break;
	default:
		echo 'Please contact the owner';
		break;
}
?>