<?php 
$file = 'siteData.json';
switch ($_GET['action']) {
	case 'read':
			$result = array();
		   $handle = fopen($file,'r');
		   if ($handle) {
			    while (($line = fgets($handle)) !== false) {
			        $result[] = $line;
			    }
			    fclose($handle);
			}
			print_r($result);
		break;
	case 'write':
		$list =	json_encode(array(
			"name" => $_GET['name'],
			"point" => $_GET['point']));
				$handle = fopen($file, "a");
				fwrite($handle,$list."\n");
				print_r($list);
		break;
	default:
		echo 'Please contact the owner';
		break;
}

?>
