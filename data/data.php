<?php 
switch ($_GET['action']) {
	case 'read':
		return 'read';
		break;
	case 'write':
		return 'write';
		break;
	default:
		return 'Please contact the owner';
		break;
}
?>