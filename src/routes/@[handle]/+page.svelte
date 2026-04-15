<script lang="ts">
	import { deleteAccount, logout } from "$lib/remote/auth.remote";
</script>

<form {...logout}>
    <button type="submit" class="btn">Sign Out</button>
</form>

<form {...deleteAccount}>
    <button type="submit" class="btn">Delete Account</button>
</form>

