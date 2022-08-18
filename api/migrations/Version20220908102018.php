<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220908102018 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE category_product_merchandising_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE category_product_merchandising (id INT NOT NULL, category_id VARCHAR(255) NOT NULL, catalog_id INT DEFAULT NULL, localized_catalog_id INT DEFAULT NULL, product_id INT NOT NULL, position INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CF6203D812469DE2 ON category_product_merchandising (category_id)');
        $this->addSql('CREATE INDEX IDX_CF6203D8CC3C66FC ON category_product_merchandising (catalog_id)');
        $this->addSql('CREATE INDEX IDX_CF6203D84CF5AFB9 ON category_product_merchandising (localized_catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id ON category_product_merchandising (category_id, product_id) WHERE ((catalog_id IS NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id_catalog_id ON category_product_merchandising (category_id, product_id, catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id_catalog_id_localized_catalog_id ON category_product_merchandising (category_id, product_id, catalog_id, localized_catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NOT NULL))');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D812469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D8CC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D84CF5AFB9 FOREIGN KEY (localized_catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE category_product_merchandising_id_seq CASCADE');
        $this->addSql('DROP TABLE category_product_merchandising');
    }
}
