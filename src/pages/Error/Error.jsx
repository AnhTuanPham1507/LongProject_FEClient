import { Link, useRouteError } from "react-router-dom";
import "./Error.css"

export default function Error() {
  const error = useRouteError();

  return (
    <div id="notfound">
		<div className="notfound">
			<div className="notfound-404">
				<h1>Oops!</h1>
				<h2>{error}</h2>
			</div>
			<Link to="/">Go TO Homepage</Link>
		</div>
	</div>
  );
}