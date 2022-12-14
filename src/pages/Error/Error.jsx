import { Link, useRouteError } from "react-router-dom";
import "./Error.css"

export default function Error() {
  const error = useRouteError();

  return (
    <div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>Oops!</h1>
				<h2>{error}</h2>
			</div>
			<Link to="/">Go TO Homepage</Link>
		</div>
	</div>
  );
}