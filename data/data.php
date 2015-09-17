<?php
$file = 'siteData.json';
$MAX_SCORES = 5;

switch ($_GET['action']) {
	case 'read':
		$result = '';
	   	$file_content = file_get_contents($file);
	   	if ($file_content == '') {
		    $result = '{"scores":[]}';
		} else {
			$result = $file_content;
		}
		echo $result;
		break;
	case 'write':
		$scores = "";
		$scores = json_decode(file_get_contents($file));
		$score = array(array(
			"name" => $_GET['name'],
			"points" => (int)$_GET['points']
		));
		var_dump($score);

		$flag = false; // variable tampon
		$i = $MAX_SCORES;
		while ($i > 0){
			echo $i;
			// Test si on est toujours dans la range du tableau
			// Si oui, on teste le résultat du orderScore
			$order = orderScore($scores->scores, $i-1, $_GET['points']);
			if (isset($order) && $order && $i-1 != 0) {
				$flag = true;
			// Si c'est le dernier élément du tableau et que l'on est supérieur
			} else if (isset($order) && $order && $i-1 == 0) { 
				$scores->scores = insertIntoRank($scores->scores, 0, $score);
			// Cas par défaut
			// Si l'on est supérieur à au moins un score mais inférieur à l'un des suivant
			} else {
				if ($flag) {
					$scores->scores = insertIntoRank($scores->scores, $i, $score);
					break; // Sors de la boucle, on vient d'ajouter le score
				}
			}
			$i--;
		}
		$handle = fopen($file, 'w');
		fwrite($handle, json_encode($scores, JSON_PRETTY_PRINT));
		break;
	default:
		echo 'Bitch please';
		break;
}

// Retourne True si l'on respect la règle de calcul du score
// (on est supérieur à la valeur du rank)
function orderScore($scores, $rank, $value){
	$res = $scores[$rank]->points < $value;
	return $res;
}

// Retourne un tableau contenau autant d'élément que $array
// mais en insérant $value au rang $rank
function insertIntoRank($array, $rank, $value){
	$tmp1 = $array;
	$tmp2 = $array;
	$begin = array_splice($tmp1, 0, $rank);
	$end = array_splice($tmp2, $rank);
	$res = array_merge($begin, $value, $end);
	array_pop($res);
	return $res;
}


?>
