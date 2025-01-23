import Logo from "./Logo";
import Menu from "./Menu";

const NavbarContainer = () => {
  return (
    <section className="bg-[#dc9aff1c] h-[70px]">
      <article className="m-auto h-[70px] flex w-[90%] items-center justify-between">
        <Logo />
        <Menu />
      </article>
    </section>
  );
};

export default NavbarContainer;
