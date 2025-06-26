const MY_NAME = "Steven Sousa";
const CURRENT_YEAR = new Date().getFullYear();

export default function Copyright() {
    return (
        <div className="mb-8">
            <p className="text-primary">© {CURRENT_YEAR} {MY_NAME}. All rights reserved.</p>
        </div>
    );
}